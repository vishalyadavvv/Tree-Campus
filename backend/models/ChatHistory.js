const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
  },
}, {
  timestamps: true,
});

// Index for efficient querying
chatHistorySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
