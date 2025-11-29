const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
  },
  questions: [{
    question: {
      type: String,
      required: true,
    },
    options: [{
      type: String,
      required: true,
    }],
    correctAnswer: {
      type: Number, // Index of correct option (0-based)
      required: true,
    },
    explanation: {
      type: String,
      default: '',
    },
  }],
  passingScore: {
    type: Number,
    default: 70, // Percentage
    min: 0,
    max: 100,
  },
  timeLimit: {
    type: Number, // Time limit in minutes
    default: 0, // 0 means no time limit
  },
}, {
  timestamps: true,
});

// Virtual for question count
quizSchema.virtual('questionCount').get(function() {
  return this.questions.length;
});

module.exports = mongoose.model('Quiz', quizSchema);
