import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },

    phone: {
      type: String,
      trim: true,
      required: function() { return !this.googleId; },
      validate: {
        validator: function(v) {
          if (!this.googleId && !v) return false;
          if (v && v.length !== 10) return false;
          return true;
        },
        message: "Phone number must be 10 digits"
      }
    },

    password: {
      type: String,
      required: function() { return !this.googleId; },
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    enrolledCourses: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        progress: { type: Number, default: 0 },
        enrolledAt: { type: Date, default: Date.now },
      },
    ],

    completedLessons: [
      {
        lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
        completedAt: { type: Date, default: Date.now },
      },
    ],

    certificates: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Certificate" }
    ],

    isVerified: { type: Boolean, default: false },

    otp: { type: String, select: false },
    otpExpiry: { type: Date, select: false },

    resetPasswordToken: { type: String, select: false },
    resetPasswordExpiry: { type: Date, select: false },

    profilePicture: { type: String, default: "" },
  },
  { timestamps: true }
);

// ----------------------------------
// 🚀 Create Unique Indexes CLEANLY
// ----------------------------------
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });

// ----------------------------------
// 🔐 Hash password before save
// ----------------------------------
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate OTP
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = otp;
  this.otpExpiry = Date.now() + 10 * 60 * 1000;
  return otp;
};

export default mongoose.model("User", userSchema);
