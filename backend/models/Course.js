const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  thumbnail: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'AI/ML', 'Other'],
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  duration: {
    type: Number, // Total duration in minutes
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  tags: [{
    type: String,
  }],
}, {
  timestamps: true,
});

// Virtual for student count
courseSchema.virtual('studentCount').get(function() {
  return this.students.length;
});

// Virtual for lesson count
courseSchema.virtual('lessonCount').get(function() {
  return this.lessons.length;
});

module.exports = mongoose.model('Course', courseSchema);
