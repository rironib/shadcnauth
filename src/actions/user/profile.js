"use server";

import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

// Ensure models are registered
const _models = { User };

/**
 * 👤 Get user profile by ID or username (Public/User)
 */
export async function getUserProfileAction(identifier, type = "id") {
  try {
    await connectDB();

    let user;
    if (type === "username") {
      user = await User.findOne({
        $or: [
          { username: { $regex: new RegExp(`^${identifier}$`, "i") } },
          { previousUsernames: { $regex: new RegExp(`^${identifier}$`, "i") } },
        ],
      })
        .select("-password")
        .lean();
    } else {
      user = await User.findById(identifier).select("-password").lean();
    }

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(user)),
    };
  } catch (error) {
    console.error("getUserProfileAction error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 👤 Update user profile (User)
 */
export async function updateUserProfileAction(id, data) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    // Only allow the user themselves or an admin to update
    if (session.user.id !== id && session.user.role !== "admin") {
      return { success: false, error: "Forbidden" };
    }

    await connectDB();

    const allowedFields = [
      "username",
      "name",
      "bio",
      "country",
      "website",
      "socialLinks",
      "status",
    ];

    const updateSet = {};
    const updateAddToSet = {};

    // Handle username logic
    if (data.username) {
      const user = await User.findById(id);
      if (!user) return { success: false, error: "User not found" };

      if (
        user.username &&
        user.usernameLastChanged &&
        session.user.role !== "admin"
      ) {
        const lastChanged = new Date(user.usernameLastChanged);
        const now = new Date();
        const daysSinceChange = Math.floor(
          (now - lastChanged) / (1000 * 60 * 60 * 24),
        );

        if (daysSinceChange < 30) {
          return {
            success: false,
            error: `You can only change your username once every 30 days. ${30 - daysSinceChange} days left.`,
          };
        }
      }

      const normalizedUsername = data.username.trim().toLowerCase();
      const usernameRegex = /^[a-z0-9_]+$/;
      if (!usernameRegex.test(normalizedUsername)) {
        return { success: false, error: "Invalid username format." };
      }

      if (normalizedUsername.length < 3) {
        return {
          success: false,
          error: "Username must be at least 3 characters.",
        };
      }

      const existingUser = await User.findOne({
        $or: [
          { username: normalizedUsername },
          { previousUsernames: normalizedUsername },
        ],
        _id: { $ne: id },
      });

      if (existingUser) {
        return { success: false, error: "Username is already taken." };
      }

      if (user.username) {
        updateAddToSet.previousUsernames = user.username;
      }
      updateSet.username = normalizedUsername;
      updateSet.usernameLastChanged = new Date();
    }

    Object.keys(data).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateSet[key] = data[key];
      }
    });

    const updateOperations = {};
    if (Object.keys(updateSet).length > 0) updateOperations.$set = updateSet;
    if (Object.keys(updateAddToSet).length > 0)
      updateOperations.$addToSet = updateAddToSet;

    const updatedUser = await User.findByIdAndUpdate(id, updateOperations, {
      new: true,
      runValidators: true,
    }).select("-password -usernameLastChanged");

    revalidatePath(`/user/${updatedUser.username}`);
    revalidatePath(`/dashboard/settings`);

    return { success: true, data: JSON.parse(JSON.stringify(updatedUser)) };
  } catch (error) {
    console.error("updateUserProfileAction error:", error);
    return { success: false, error: error.message };
  }
}
