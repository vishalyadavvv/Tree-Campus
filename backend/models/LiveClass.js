import mongoose from 'mongoose';

const liveClassSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a class title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  platform: {
    type: String,
    enum: ['Zoom', 'Google Meet', 'YouTube'],
    required: [true, 'Please select a platform']
  },
  link: {
    type: String,
    required: [true, 'Please provide a meeting link']
  },
  scheduledAt: {
    type: Date,
    required: [true, 'Please provide a scheduled time']
  },
  duration: {
    type: Number,
    required: [true, 'Please provide duration in minutes'],
    default: 60
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  instructor: {
    type: String,
    required: [true, 'Please provide instructor name']
  },
  maxParticipants: {
    type: Number,
    default: 100
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed', 'cancelled'],
    default: 'scheduled'
  }
}, {
  timestamps: true
});

const LiveClass = mongoose.model('LiveClass', liveClassSchema);

export default LiveClass;
