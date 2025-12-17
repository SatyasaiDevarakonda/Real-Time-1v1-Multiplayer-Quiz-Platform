const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: [arr => arr.length === 4, 'Must have exactly 4 options']
  },
  correctAnswer: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    default: 'General'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
