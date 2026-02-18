import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import wpHasher from "wordpress-hash-node";
import crypto from "crypto";

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
          // Allow undefined/null for Google users or if field is being cleared and not required
          if (!v) {
            return this.googleId ? true : false;
          }
          // If value exists, it must be 10 digits
          return v.length === 10;
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
    verificationId: { type: String, select: false },

    resetPasswordToken: { type: String, select: false },
    resetPasswordExpiry: { type: Date, select: false },

    profilePicture: { type: String, default: "" },
    age: { type: Number },
    education: { type: String },
  },
  { timestamps: true }
);

// ----------------------------------
// 🚀 Create Unique Indexes CLEANLY
// ----------------------------------
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { 
  unique: true, 
  partialFilterExpression: { phone: { $type: "string" } } 
});

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
  if (!this.password) return false;

  let hash = this.password;

  // Handle malformed prefixes
  if (hash.startsWith("2y$")) {
    hash = "$" + hash;
  } else if (hash.startsWith("wp$2y$")) {
    hash = "$" + hash;
  }

  // ✅ Handle MD5 (32 char, no $ prefix)
  if (!hash.startsWith("$") && hash.length === 32) {
    const md5Hash = crypto
      .createHash("md5")
      .update(candidatePassword)
      .digest("hex");

    return md5Hash === hash;
  }

  // ✅ Handle WordPress phpass
  if (hash.startsWith("$P$") || hash.startsWith("$H$")) {
    return wpHasher.CheckPassword(candidatePassword, hash);
  }

  // ✅ Handle WordPress bcrypt with $wp$ prefix
  if (hash.startsWith("$wp$2y$")) {
    hash = "$2a$" + hash.substring(6);
  }

  // ✅ Convert $2y$ → $2a$
  if (hash.startsWith("$2y$")) {
    hash = "$2a$" + hash.substring(4);
  }

  return await bcrypt.compare(candidatePassword, hash);
};

// Generate OTP
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = otp;
  this.otpExpiry = Date.now() + 10 * 60 * 1000;
  return otp;
};

export default mongoose.model("User", userSchema);
