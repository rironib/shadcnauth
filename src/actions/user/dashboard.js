"use server";

import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";

// Ensure models are registered
const _models = { User };

/**
 * 📊 Get user dashboard statistics and recent activity (User)
 */
export async function getUserDashboardDataAction() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();
    const userId = session.user.id;

    // Fetch User Stats
    const user = await User.findById(userId);

    return {
      success: true,
      data: {
        totalThreads: 0,
        totalPosts: 0,
        totalReactions: 0,
        recentPosts: [],
        recentThreads: [],
      },
    };
  } catch (error) {
    console.error("getUserDashboardDataAction error:", error);
    return { success: false, error: "Failed to fetch dashboard data" };
  }
}
