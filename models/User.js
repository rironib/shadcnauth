import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 255,
      index: true,
    },
    provider: { type: String, default: "credentials" },
    password: {
      type: String,
      maxlength: 255,
      select: false,
    },

    // Profile Info
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      lowercase: true,
      maxlength: 100,
      unique: true,
      index: true,
      sparse: true,
    },
    usernameLastChanged: { type: Date },
    previousUsernames: [{ type: String, lowercase: true, trim: true }],
    bio: { type: String, maxlength: 500, trim: true },
    location: { type: String, trim: true },
    website: { type: String, trim: true },
    socialLinks: {
      facebook: String,
      twitter: String,
      github: String,
      linkedin: String,
    },

    // Roles & permissions
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "banned", "suspended", "pending", "deleted"],
      default: "active",
    },

    // Auth & Security
    emailVerified: { type: Date, default: null },
    verifyToken: { type: String, select: false },
    resetToken: { type: String, select: false },
    resetTokenExpiry: { type: Date },
    resetLastSent: { type: Date },
    lastActive: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes
UserSchema.index({ status: 1 });
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ lastActive: -1 });
UserSchema.index({ createdAt: 1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);
