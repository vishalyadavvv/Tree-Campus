import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  certificateNumber: {
    type: String,
    unique: true
  },
  type: {
    type: String, // 'assignment' or 'course'
    default: 'course'
  },
  score: {
     type: Number
  },
  courseTitle: String,
  userName: String,
  certificateUrl: String,
  completionPercentage: {
    type: Number,
    default: 100
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C', 'Pass'],
    default: 'Pass'
  }
}, {
  timestamps: true
});

// Generate certificate number before saving
certificateSchema.pre('save', async function(next) {
  if (!this.certificateNumber) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    this.certificateNumber = `CERT-${timestamp}-${random}`;
  }
  
});

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;
