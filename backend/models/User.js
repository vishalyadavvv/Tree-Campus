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
    savedBlogs: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Blog" }
    ],
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

  // Detect if the password is already hashed (WordPress or bcrypt)
  const hash = this.password;
  if (
    hash.startsWith("$P$") || // WordPress Phpass
    hash.startsWith("$H$") || // WordPress alternative Phpass
    hash.startsWith("$2y$") || // WordPress bcrypt
    hash.startsWith("$2a$") || // Standard bcrypt
    hash.startsWith("$2b$") || // Modern bcrypt
    hash.startsWith("$wp$")    // Legacy prefix
  ) {
    return; // Don't re-hash already hashed passwords
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
// Compare password
// Compare password
// Compare password
// Compare password
// Update your comparePassword method in User.js:

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;

  const hash = this.password;
  console.log("🔍 [DEBUG] Original Hash in DB:", hash);

  // Handle WordPress bcrypt ($2y$)
  if (hash.startsWith("$2y$")) {
    console.log("🔍 [DEBUG] Found $2y$ hash, converting to $2b$ for comparison");
    
    // Convert $2y$ to $2b$ for bcrypt comparison
    const convertedHash = "$2b$" + hash.substring(4);
    console.log("🔍 [DEBUG] Converted hash:", convertedHash);
    
    try {
      const match = await bcrypt.compare(candidatePassword, convertedHash);
      console.log("🔍 [DEBUG] Bcrypt comparison result:", match);
      return match;
    } catch (e) {
      console.error("❌ Bcrypt comparison error:", e.message);
      
      // Try with original $2y$ as fallback
      try {
        const match = await bcrypt.compare(candidatePassword, hash);
        console.log("🔍 [DEBUG] Bcrypt comparison with original $2y$:", match);
        return match;
      } catch (e2) {
        console.error("❌ Bcrypt comparison with $2y$ also failed:", e2.message);
        return false;
      }
    }
  }

  // Handle WordPress phpass ($P$ or $H$)
  if (hash.startsWith("$P$") || hash.startsWith("$H$")) {
    return wpHasher.CheckPassword(candidatePassword, hash);
  }

  // Handle MD5
  if (!hash.startsWith("$") && hash.length === 32) {
    const md5Hash = crypto.createHash("md5").update(candidatePassword).digest("hex");
    return md5Hash === hash;
  }

  // Standard bcrypt ($2a$ or $2b$)
  if (hash.startsWith("$2a$") || hash.startsWith("$2b$")) {
    try {
      return await bcrypt.compare(candidatePassword, hash);
    } catch (err) {
      console.error("❌ Bcrypt error:", err.message);
      return false;
    }
  }

  // Plain text fallback (remove this in production)
  console.log("🔍 [DEBUG] Trying plain text comparison");
  return candidatePassword === hash;
};

// Generate OTP
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = otp;
  this.otpExpiry = Date.now() + 10 * 60 * 1000;
  return otp;
};

export default mongoose.model("User", userSchema);
