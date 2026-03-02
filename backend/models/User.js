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
    if (!v) {
      return this.googleId ? true : false;
    }
    if (v.startsWith('wp_')) return true; // allow WordPress migrated users
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
    isWpMigrated: { type: Boolean, default: false },

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
  partialFilterExpression: { 
    phone: { $type: "string" },
    isWpMigrated: { $ne: true }  // wp_ users skip unique check
  } 
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
// Update your comparePassword method in User.js:

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password || !candidatePassword) {
    console.log("🔍 [DEBUG] Missing password or candidate");
    return false;
  }

  let hash = this.password.trim();
  
  // 1. Strip $wp$ prefix if present
if (hash.startsWith("$wp$")) {
  hash = hash.replace("$wp$", "$"); // replace "$wp$" with just "$"
}

  // 2. Format Detection
  const isPHPass = hash.startsWith("$P$") || hash.startsWith("$H$");
  const isBcrypt = hash.startsWith("$2y$") || hash.startsWith("$2a$") || hash.startsWith("$2b$");
  const isMD5 = !hash.startsWith("$") && hash.length === 32;

  console.log("🔍 [DEBUG] Password Check:", {
    hashStart: hash.substring(0, 10),
    candidateLength: candidatePassword.length,
    format: isPHPass ? "PHPass" : (isBcrypt ? "Bcrypt" : (isMD5 ? "MD5" : "Unknown"))
  });

  // 3. Handle WordPress Portable Hashes ($P$ or $H$)
  if (isPHPass) {
    console.log("🔍 [DEBUG] Using wordpress-hash-node (Portable)");
    return wpHasher.CheckPassword(candidatePassword, hash);
  }

    // 4. Handle Bcrypt Hashes ($2y$, $2a$, $2b$)
  if (isBcrypt) {
    // CRITICAL: Standardize $2y$ to $2a$ for library compatibility
    const normalizedHash = hash.replace(/^\$2y\$/, '$2a$');
    console.log("🔍 [DEBUG] Using bcryptjs (Normalized to $2a$)");
    
    // Hex Debug
    const candidateHex = Buffer.from(candidatePassword).toString('hex');
    const hashHex = Buffer.from(normalizedHash).toString('hex');
    console.log(`🔍 [DEBUG] HEX: cand=${candidateHex}, hash=${hashHex.substring(0, 20)}...`);

    try {
      // Try exact password
      let match = await bcrypt.compare(candidatePassword, normalizedHash);
      
      // Fallback: Try trimmed password if exact fails
      if (!match && candidatePassword.trim() !== candidatePassword) {
        console.log("🔍 [DEBUG] Retrying with trimmed candidate password");
        match = await bcrypt.compare(candidatePassword.trim(), normalizedHash);
      }
      
      return match;
    } catch (err) {
      console.error("❌ Bcrypt error:", err.message);
      return false;
    }
  }

  // 5. MD5 fallback (Legacy WP)
  if (isMD5) {
    console.log("🔍 [DEBUG] Using MD5 fallback");
    const md5Hash = crypto.createHash("md5")
      .update(candidatePassword)
      .digest("hex");
    return md5Hash === hash;
  }

  // ❌ Unknown format
  console.log("⚠️ Unknown password format:", hash.substring(0, 5));
  return false;
};

// Generate OTP
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = otp;
  this.otpExpiry = Date.now() + 10 * 60 * 1000;
  console.log(`🔑 [DEBUG] Generated OTP for User: ${otp}`);
  return otp;
};

export default mongoose.model("User", userSchema);
