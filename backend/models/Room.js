const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  socketId: String,
  name: String,
  score: { type: Number, default: 0 },
  answers: [{ 
    questionIndex: Number, 
    answer: String, 
    correct: Boolean,
    timeSpent: Number 
  }]
});

const roomSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
    unique: true
  },
  players: [playerSchema],
  status: {
    type: String,
    enum: ['waiting', 'playing', 'finished'],
    default: 'waiting'
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  questionStartTime: Date,
  settings: {
    questionsPerGame: { type: Number, default: 5 },
    timePerQuestion: { type: Number, default: 15 } // seconds
  }
}, { timestamps: true });

// Generate unique room code
roomSchema.statics.generateRoomCode = async function() {
  let code;
  let exists = true;
  
  while (exists) {
    code = Math.floor(1000 + Math.random() * 9000).toString();
    exists = await this.findOne({ roomCode: code, status: { $ne: 'finished' } });
  }
  
  return code;
};

module.exports = mongoose.model('Room', roomSchema);
