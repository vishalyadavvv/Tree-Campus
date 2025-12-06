// server/models/Enrollment.js
import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'dropped'],
    default: 'active'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedLessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// ✅ CRITICAL: Prevent duplicate enrollments
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

// Update lastAccessedAt before saving
enrollmentSchema.pre('save', function(next) {
  this.lastAccessedAt = new Date();
  
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;