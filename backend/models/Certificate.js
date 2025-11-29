const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
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
  certificateId: {
    type: String,
    required: true,
    unique: true,
  },
  certificateUrl: {
    type: String,
    required: true,
  },
  issuedDate: {
    type: Date,
    default: Date.now,
  },
  completionDate: {
    type: Date,
    default: Date.now,
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'Pass'],
    default: 'Pass',
  },
}, {
  timestamps: true,
});

// Compound index
certificateSchema.index({ user: 1, course: 1 }, { unique: true });

// Generate unique certificate ID
certificateSchema.pre('save', function(next) {
  if (!this.certificateId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    this.certificateId = `TC-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Certificate', certificateSchema);
