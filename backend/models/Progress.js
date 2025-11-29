const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  completedLessons: [{
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  quizScores: [{
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  certificateIssued: {
    type: Boolean,
    default: false,
  },
  certificateUrl: {
    type: String,
    default: '',
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Compound index for efficient querying
progressSchema.index({ user: 1, course: 1 }, { unique: true });

// Method to calculate progress
progressSchema.methods.calculateProgress = async function() {
  const Course = mongoose.model('Course');
  const course = await Course.findById(this.course).populate('lessons');
  
  if (!course || course.lessons.length === 0) {
    this.overallProgress = 0;
    return 0;
  }
  
  const totalLessons = course.lessons.length;
  const completedCount = this.completedLessons.length;
  
  this.overallProgress = Math.round((completedCount / totalLessons) * 100);
  await this.save();
  
  return this.overallProgress;
};

module.exports = mongoose.model('Progress', progressSchema);
