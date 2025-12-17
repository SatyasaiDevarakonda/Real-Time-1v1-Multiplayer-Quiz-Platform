const Room = require('../models/Room');
const Question = require('../models/Question');

// In-memory store for active game timers
const gameTimers = new Map();

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    // CREATE ROOM
    socket.on('create_room', async ({ playerName }) => {
      try {
        const roomCode = await Room.generateRoomCode();
        
        // Get random questions for this game
        const questions = await Question.aggregate([
          { $sample: { size: 5 } }
        ]);

        const room = await Room.create({
          roomCode,
          players: [{ socketId: socket.id, name: playerName, score: 0 }],
          questions: questions.map(q => q._id),
          status: 'waiting'
        });

        socket.join(roomCode);
        
        socket.emit('room_created', {
          roomCode,
          player: { name: playerName, score: 0 }
        });

        console.log(`Room ${roomCode} created by ${playerName}`);
      } catch (error) {
        socket.emit('error', { message: 'Failed to create room' });
        console.error('Create room error:', error);
      }
    });

    // JOIN ROOM
    socket.on('join_room', async ({ roomCode, playerName }) => {
      try {
        const room = await Room.findOne({ roomCode, status: 'waiting' });

        if (!room) {
          socket.emit('error', { message: 'Room not found or game already started' });
          return;
        }

        if (room.players.length >= 2) {
          socket.emit('error', { message: 'Room is full' });
          return;
        }

        // Add player to room
        room.players.push({ socketId: socket.id, name: playerName, score: 0 });
        await room.save();

        socket.join(roomCode);

        // Notify the joining player
        socket.emit('player_joined', {
          roomCode,
          players: room.players.map(p => ({ name: p.name, score: p.score })),
          isReady: room.players.length === 2
        });

        // Notify existing player
        socket.to(roomCode).emit('player_joined', {
          roomCode,
          players: room.players.map(p => ({ name: p.name, score: p.score })),
          isReady: room.players.length === 2
        });

        console.log(`${playerName} joined room ${roomCode}`);

        // Auto-start when 2 players
        if (room.players.length === 2) {
          setTimeout(() => startGame(io, roomCode), 3000);
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to join room' });
        console.error('Join room error:', error);
      }
    });

    // SUBMIT ANSWER
    socket.on('submit_answer', async ({ roomCode, answer, timeSpent }) => {
      try {
        const room = await Room.findOne({ roomCode }).populate('questions');
        
        if (!room || room.status !== 'playing') return;

        const playerIndex = room.players.findIndex(p => p.socketId === socket.id);
        if (playerIndex === -1) return;

        const player = room.players[playerIndex];
        const currentQuestion = room.questions[room.currentQuestionIndex];

        // Prevent double answering
        const alreadyAnswered = player.answers.some(
          a => a.questionIndex === room.currentQuestionIndex
        );
        if (alreadyAnswered) return;

        // Validate answer
        const isCorrect = answer === currentQuestion.correctAnswer;
        
        // Score calculation: faster answers get more points
        let points = 0;
        if (isCorrect) {
          const timeBonus = Math.max(0, room.settings.timePerQuestion - timeSpent);
          points = 100 + (timeBonus * 10); // Base 100 + time bonus
        }

        // Record answer
        player.answers.push({
          questionIndex: room.currentQuestionIndex,
          answer,
          correct: isCorrect,
          timeSpent
        });
        player.score += points;

        await room.save();

        // Broadcast score update
        io.to(roomCode).emit('score_update', {
          players: room.players.map(p => ({
            name: p.name,
            score: p.score,
            answered: p.answers.some(a => a.questionIndex === room.currentQuestionIndex)
          }))
        });

        // Notify player of their answer result
        socket.emit('answer_result', {
          correct: isCorrect,
          correctAnswer: currentQuestion.correctAnswer,
          pointsEarned: points
        });

        // Check if both players answered
        const allAnswered = room.players.every(p =>
          p.answers.some(a => a.questionIndex === room.currentQuestionIndex)
        );

        if (allAnswered) {
          clearTimeout(gameTimers.get(roomCode));
          setTimeout(() => nextQuestion(io, roomCode), 2000);
        }
      } catch (error) {
        console.error('Submit answer error:', error);
      }
    });

    // DISCONNECT
    socket.on('disconnect', async () => {
      console.log(`Player disconnected: ${socket.id}`);
      
      try {
        const room = await Room.findOne({
          'players.socketId': socket.id,
          status: { $ne: 'finished' }
        });

        if (room) {
          // Clear timer if exists
          clearTimeout(gameTimers.get(room.roomCode));
          gameTimers.delete(room.roomCode);

          // Notify other player
          io.to(room.roomCode).emit('player_disconnected', {
            message: 'Opponent disconnected. Game ended.'
          });

          // Mark room as finished
          room.status = 'finished';
          await room.save();
        }
      } catch (error) {
        console.error('Disconnect handling error:', error);
      }
    });
  });
};

// START GAME
async function startGame(io, roomCode) {
  try {
    const room = await Room.findOne({ roomCode }).populate('questions');
    if (!room || room.players.length !== 2) return;

    room.status = 'playing';
    room.currentQuestionIndex = 0;
    room.questionStartTime = new Date();
    await room.save();

    io.to(roomCode).emit('start_quiz', {
      totalQuestions: room.questions.length,
      timePerQuestion: room.settings.timePerQuestion
    });

    // Send first question after brief delay
    setTimeout(() => sendQuestion(io, roomCode), 1000);
  } catch (error) {
    console.error('Start game error:', error);
  }
}

// SEND QUESTION
async function sendQuestion(io, roomCode) {
  try {
    const room = await Room.findOne({ roomCode }).populate('questions');
    if (!room || room.status !== 'playing') return;

    const question = room.questions[room.currentQuestionIndex];
    
    room.questionStartTime = new Date();
    await room.save();

    io.to(roomCode).emit('next_question', {
      questionIndex: room.currentQuestionIndex,
      totalQuestions: room.questions.length,
      question: question.question,
      options: question.options,
      timeLimit: room.settings.timePerQuestion
    });

    // Set timer for this question
    const timer = setTimeout(() => {
      handleTimeUp(io, roomCode);
    }, room.settings.timePerQuestion * 1000);

    gameTimers.set(roomCode, timer);
  } catch (error) {
    console.error('Send question error:', error);
  }
}

// HANDLE TIME UP
async function handleTimeUp(io, roomCode) {
  try {
    const room = await Room.findOne({ roomCode }).populate('questions');
    if (!room || room.status !== 'playing') return;

    const currentQuestion = room.questions[room.currentQuestionIndex];

    // Mark unanswered players
    for (const player of room.players) {
      const hasAnswered = player.answers.some(
        a => a.questionIndex === room.currentQuestionIndex
      );
      if (!hasAnswered) {
        player.answers.push({
          questionIndex: room.currentQuestionIndex,
          answer: null,
          correct: false,
          timeSpent: room.settings.timePerQuestion
        });
      }
    }
    await room.save();

    io.to(roomCode).emit('time_up', {
      correctAnswer: currentQuestion.correctAnswer,
      players: room.players.map(p => ({ name: p.name, score: p.score }))
    });

    setTimeout(() => nextQuestion(io, roomCode), 2000);
  } catch (error) {
    console.error('Time up error:', error);
  }
}

// NEXT QUESTION
async function nextQuestion(io, roomCode) {
  try {
    const room = await Room.findOne({ roomCode }).populate('questions');
    if (!room || room.status !== 'playing') return;

    room.currentQuestionIndex += 1;

    // Check if game is over
    if (room.currentQuestionIndex >= room.questions.length) {
      room.status = 'finished';
      await room.save();

      // Determine winner
      const [player1, player2] = room.players;
      let winner = null;
      if (player1.score > player2.score) winner = player1.name;
      else if (player2.score > player1.score) winner = player2.name;

      io.to(roomCode).emit('game_over', {
        winner,
        isDraw: winner === null,
        players: room.players.map(p => ({
          name: p.name,
          score: p.score,
          correctAnswers: p.answers.filter(a => a.correct).length,
          totalQuestions: room.questions.length
        }))
      });

      gameTimers.delete(roomCode);
      return;
    }

    await room.save();
    sendQuestion(io, roomCode);
  } catch (error) {
    console.error('Next question error:', error);
  }
}

module.exports = initializeSocket;
