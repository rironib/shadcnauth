"use server";

import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";

// Ensure models are registered
const _models = { User };

/**
 * 📊 Get admin dashboard overview stats and activity (Admin)
 */
export async function getAdminDashboardStatsAction() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    // Stats
    const totalUsers = await User.countDocuments({});

    return {
      success: true,
      data: {
        stats: {
          totalUsers,
        },
        recentActivity: [],
      },
    };
  } catch (error) {
    console.error("getAdminDashboardStatsAction error:", error);
    return { success: false, error: "Failed to fetch admin dashboard stats" };
  }
}
