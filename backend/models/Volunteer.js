import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema(
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
      unique: true,
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
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      minlength: [5, 'Address must be at least 5 characters long'],
      maxlength: [500, 'Address cannot exceed 500 characters']
    },
    motivation: {
      type: String,
      required: [true, 'Motivation is required'],
      trim: true,
      minlength: [20, 'Please provide at least 20 characters explaining your motivation'],
      maxlength: [2000, 'Motivation cannot exceed 2000 characters']
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
volunteerSchema.index({ email: 1 });

// Index for status filtering
volunteerSchema.index({ status: 1, createdAt: -1 });

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

export default Volunteer;
