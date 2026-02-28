import mongoose from 'mongoose';

const accountDeletionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      minlength: [10, 'Phone number must be at least 10 digits'],
      maxlength: [15, 'Phone number cannot exceed 15 digits']
    },
    reason: {
      type: String,
      trim: true,
      maxlength: [1000, 'Reason cannot exceed 1000 characters']
    },
    status: {
      type: String,
      enum: ['pending_verification', 'verified', 'processing', 'completed', 'cancelled'],
      default: 'pending_verification'
    },
    verificationToken: {
      type: String,
      select: false // Don't return this in queries by default
    },
    verificationTokenExpires: {
      type: Date,
      select: false
    },
    verifiedAt: {
      type: Date
    },
    scheduledDeletionDate: {
      type: Date
    },
    completedAt: {
      type: Date
    },
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpiry: {
      type: Date,
      select: false,
    }
  },
  {
    timestamps: true
  }
);

// Generate OTP method
accountDeletionSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = otp;
  this.otpExpiry = Date.now() + 10 * 60 * 1000;
  console.log(`🔑 [DEBUG] Generated OTP for Account Deletion: ${otp}`);
  return otp;
};

// Index for faster email lookups
accountDeletionSchema.index({ email: 1 });

// Index for status and date filtering
accountDeletionSchema.index({ status: 1, createdAt: -1 });

// Index for scheduled deletion processing
accountDeletionSchema.index({ scheduledDeletionDate: 1, status: 1 });

// Method to check if verification token is expired
accountDeletionSchema.methods.isVerificationTokenExpired = function() {
  return this.verificationTokenExpires && this.verificationTokenExpires < Date.now();
};

const AccountDeletion = mongoose.model('AccountDeletion', accountDeletionSchema);

export default AccountDeletion;
