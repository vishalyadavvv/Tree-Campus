import mongoose from 'mongoose';

const schoolRegistrationSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      required: [true, 'School name is required'],
      trim: true,
      minlength: [2, 'School name must be at least 2 characters long'],
      maxlength: [200, 'School name cannot exceed 200 characters']
    },
    schoolEmail: {
      type: String,
      required: [true, 'School email is required'],
      unique: true, 
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid school email address'
      ]
    },
    schoolAddress: {
      type: String,
      required: [true, 'School address is required'],
      trim: true,
      minlength: [5, 'School address must be at least 5 characters long'],
      maxlength: [500, 'School address cannot exceed 500 characters']
    },
    schoolPhone: {
      type: String,
      required: [true, 'School phone number is required'],
      trim: true,
      minlength: [10, 'School phone number must be at least 10 digits'],
      maxlength: [15, 'School phone number cannot exceed 15 digits']
    },
    contactPersonName: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true,
      minlength: [2, 'Contact person name must be at least 2 characters long'],
      maxlength: [100, 'Contact person name cannot exceed 100 characters']
    },
    contactPersonEmail: {
      type: String,
      required: [true, 'Contact person email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid contact person email address'
      ]
    },
    contactPersonPhone: {
      type: String,
      required: [true, 'Contact person phone number is required'],
      trim: true,
      minlength: [10, 'Contact person phone number must be at least 10 digits'],
      maxlength: [15, 'Contact person phone number cannot exceed 15 digits']
    },
    termsAccepted: {
      type: Boolean,
      required: [true, 'Terms acceptance is required'],
      validate: {
        validator: function(value) {
          return value === true;
        },
        message: 'You must accept the terms and conditions'
      }
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'approved', 'rejected'],
      default: 'pending'
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpiry: {
      type: Date,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true
  }
);

// Generate OTP method
schoolRegistrationSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = otp;
  this.otpExpiry = Date.now() + 10 * 60 * 1000;
  return otp;
};

// ✅ Keep only the compound index for status filtering
schoolRegistrationSchema.index({ status: 1, createdAt: -1 });

const SchoolRegistration = mongoose.model('SchoolRegistration', schoolRegistrationSchema);

export default SchoolRegistration;