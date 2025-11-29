const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Lesson description is required'],
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  videoUrl: {
    type: String,
    default: '',
  },
  duration: {
    type: Number, // Duration in minutes
    default: 0,
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
  },
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'video', 'link', 'other'],
    },
  }],
  isFree: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
lessonSchema.index({ course: 1, order: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
