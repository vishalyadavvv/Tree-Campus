import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  motivation: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'active', 'inactive'],
    default: 'pending'
  },
  skills: [{
    type: String,
    trim: true
  }],
  availability: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create index for better query performance
volunteerSchema.index({ email: 1 });
volunteerSchema.index({ status: 1 });
volunteerSchema.index({ createdAt: -1 });

export default mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchema);