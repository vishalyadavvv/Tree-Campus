const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Live class title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scheduledTime: {
    type: Date,
    required: [true, 'Scheduled time is required'],
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
    default: 60,
  },
  platform: {
    type: String,
    enum: ['Zoom', 'YouTube', 'Other'],
    required: true,
  },
  meetingLink: {
    type: String,
    required: [true, 'Meeting link is required'],
  },
  meetingId: {
    type: String,
    default: '',
  },
  passcode: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  recordingUrl: {
    type: String,
    default: '',
  },
  resources: [{
    title: String,
    url: String,
  }],
}, {
  timestamps: true,
});

// Index for efficient querying
liveClassSchema.index({ scheduledTime: 1, isActive: 1 });
liveClassSchema.index({ course: 1 });

module.exports = mongoose.model('LiveClass', liveClassSchema);
