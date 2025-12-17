import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const GameContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export const GameProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [gameStatus, setGameStatus] = useState('idle'); // idle, waiting, playing, finished
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timePerQuestion, setTimePerQuestion] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [gameResults, setGameResults] = useState(null);
  const [error, setError] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    newSocket.on('error', (data) => {
      setError(data.message);
      setTimeout(() => setError(null), 5000);
    });

    newSocket.on('room_created', (data) => {
      setRoomCode(data.roomCode);
      setPlayers([data.player]);
      setGameStatus('waiting');
    });

    newSocket.on('player_joined', (data) => {
      setPlayers(data.players);
      if (data.isReady) {
        // Game will start soon
      }
    });

    newSocket.on('start_quiz', (data) => {
      setTotalQuestions(data.totalQuestions);
      setTimePerQuestion(data.timePerQuestion);
      setGameStatus('playing');
      setSelectedAnswer(null);
      setAnswerResult(null);
    });

    newSocket.on('next_question', (data) => {
      setCurrentQuestion({
        question: data.question,
        options: data.options
      });
      setQuestionIndex(data.questionIndex);
      setTotalQuestions(data.totalQuestions);
      setTimeLeft(data.timeLimit);
      setSelectedAnswer(null);
      setAnswerResult(null);
    });

    newSocket.on('score_update', (data) => {
      setPlayers(data.players);
    });

    newSocket.on('answer_result', (data) => {
      setAnswerResult(data);
    });

    newSocket.on('time_up', (data) => {
      setAnswerResult({
        correct: false,
        correctAnswer: data.correctAnswer,
        timeUp: true
      });
      setPlayers(data.players);
    });

    newSocket.on('game_over', (data) => {
      setGameResults(data);
      setGameStatus('finished');
    });

    newSocket.on('player_disconnected', (data) => {
      setError(data.message);
      setGameStatus('finished');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameStatus !== 'playing' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus, currentQuestion]);

  // Actions
  const createRoom = useCallback((name) => {
    if (socket && name.trim()) {
      setPlayerName(name.trim());
      socket.emit('create_room', { playerName: name.trim() });
    }
  }, [socket]);

  const joinRoom = useCallback((code, name) => {
    if (socket && code.trim() && name.trim()) {
      setPlayerName(name.trim());
      setRoomCode(code.trim());
      socket.emit('join_room', { roomCode: code.trim(), playerName: name.trim() });
    }
  }, [socket]);

  const submitAnswer = useCallback((answer) => {
    if (socket && !selectedAnswer && gameStatus === 'playing') {
      const timeSpent = timePerQuestion - timeLeft;
      setSelectedAnswer(answer);
      socket.emit('submit_answer', { roomCode, answer, timeSpent });
    }
  }, [socket, selectedAnswer, gameStatus, roomCode, timePerQuestion, timeLeft]);

  const resetGame = useCallback(() => {
    setRoomCode('');
    setPlayers([]);
    setGameStatus('idle');
    setCurrentQuestion(null);
    setQuestionIndex(0);
    setTotalQuestions(0);
    setTimeLeft(0);
    setSelectedAnswer(null);
    setAnswerResult(null);
    setGameResults(null);
    setError(null);
  }, []);

  const value = {
    connected,
    playerName,
    roomCode,
    players,
    gameStatus,
    currentQuestion,
    questionIndex,
    totalQuestions,
    timeLeft,
    timePerQuestion,
    selectedAnswer,
    answerResult,
    gameResults,
    error,
    createRoom,
    joinRoom,
    submitAnswer,
    resetGame
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
