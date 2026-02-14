"use server";

import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mailer";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { hash } from "bcryptjs";
import crypto from "node:crypto";

// Ensure models are registered
const _models = { User };

const EMAIL_REGEX = new RegExp(/^[A-Za-z0-9._]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/);
const RESET_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;
const RESET_REQUEST_COOLDOWN_MS = 24 * 60 * 60 * 1000;

function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}

function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
}

/**
 * 🔐 Register a new user
 */
export async function registerAction(data) {
  try {
    const { name, username, email, password } = data;

    if (!name || !username || !email || !password) {
      return { success: false, error: "All fields are required" };
    }

    if (
      password.length < 8 ||
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[\W_]/.test(password)
    ) {
      return {
        success: false,
        error: "Password does not meet complexity requirements",
      };
    }

    if (!isValidEmail(email)) {
      return { success: false, error: "Invalid email format" };
    }

    if (
      username.length < 3 ||
      username.length > 20 ||
      !/^[a-z0-9_]+$/.test(username)
    ) {
      return { success: false, error: "Invalid username format" };
    }

    await connectDB();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    const existing = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { username: normalizedUsername },
        { previousUsernames: normalizedUsername },
      ],
    });

    if (existing) {
      if (existing.email === normalizedEmail)
        return { success: false, error: "Email exists" };
      return { success: false, error: "Username taken or used previously" };
    }

    const hashedPassword = await hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    await sendVerificationEmail(email, token);

    await User.create({
      name,
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      verifyToken: token,
    });

    return {
      success: true,
      message: "Registration successful. Check your email.",
    };
  } catch (error) {
    console.error("registerAction error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 🔐 Forgot password request
 */
export async function forgotPasswordAction(email) {
  try {
    if (!email || !isValidEmail(email))
      return { success: false, error: "Valid email required" };

    await connectDB();
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+resetToken +resetLastSent",
    );

    if (!user) {
      return {
        success: true,
        message: "If registered, an email will be sent.",
      };
    }
    if (!user.emailVerified) {
      return { success: false, error: "Account not verified" };
    }

    const now = new Date();
    if (
      user.resetLastSent &&
      now - user.resetLastSent < RESET_REQUEST_COOLDOWN_MS
    ) {
      return { success: false, error: "Please wait before requesting again." };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(now.getTime() + RESET_TOKEN_EXPIRY_MS);

    await sendPasswordResetEmail(normalizedEmail, resetToken);
    await User.updateOne(
      { _id: user._id },
      { $set: { resetToken, resetTokenExpiry, resetLastSent: now } },
    );

    return { success: true, message: "Reset link sent." };
  } catch (error) {
    console.error("forgotPasswordAction error:", error);
    return { success: false, error: "Internal error" };
  }
}

/**
 * 🔐 Reset password with token
 */
export async function resetPasswordAction(token, newPassword) {
  try {
    if (!token || !newPassword || !isStrongPassword(newPassword)) {
      return { success: false, error: "Invalid token or weak password" };
    }

    await connectDB();
    const user = await User.findOne({ resetToken: token }).select(
      "+resetToken +resetTokenExpiry",
    );

    if (!user || user.resetTokenExpiry < new Date()) {
      return { success: false, error: "Invalid or expired token" };
    }

    const hashedPassword = await hash(newPassword, 10);
    await User.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpiry: "" },
      },
    );

    return { success: true, message: "Password reset successful" };
  } catch (error) {
    console.error("resetPasswordAction error:", error);
    return { success: false, error: "Internal error" };
  }
}

/**
 * 🔐 Verify email token
 */
export async function verifyEmailAction(token) {
  try {
    if (!token) return { success: false, error: "Token required" };

    await connectDB();
    const user = await User.findOne({ verifyToken: token }).select(
      "+verifyToken",
    );

    if (!user) return { success: false, error: "Invalid token" };
    if (user.emailVerified)
      return { success: false, error: "Already verified" };

    await User.updateOne(
      { verifyToken: token },
      { $set: { emailVerified: new Date() } },
    );

    return { success: true, message: "Verification success" };
  } catch (error) {
    console.error("verifyEmailAction error:", error);
    return { success: false, error: "Internal error" };
  }
}
