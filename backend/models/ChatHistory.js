import mongoose from 'mongoose';

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
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
  },
  isTeacher: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true,
});

// Index for efficient querying
chatHistorySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('ChatHistory', chatHistorySchema);
