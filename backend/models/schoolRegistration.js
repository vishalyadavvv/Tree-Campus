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
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// Index for faster email lookups
schoolRegistrationSchema.index({ schoolEmail: 1 });

// Index for status filtering
schoolRegistrationSchema.index({ status: 1, createdAt: -1 });

const SchoolRegistration = mongoose.model('SchoolRegistration', schoolRegistrationSchema);

export default SchoolRegistration;
