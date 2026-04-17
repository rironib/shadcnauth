"use server";

import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";

// Ensure models are registered
const _models = { User };

/**
 * 🛠️ Get moderator dashboard overview (Moderator/Admin)
 */
export async function getModeratorDashboardStatsAction() {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "moderator" && session.user.role !== "admin")
    ) {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    return {
      success: true,
      data: {
        stats: {
          reports: 0,
        },
        recentReports: [],
      },
    };
  } catch (error) {
    console.error("getModeratorDashboardStatsAction error:", error);
    return {
      success: false,
      error: "Failed to fetch moderator dashboard stats",
    };
  }
}

/**
 * 🛠️ Get moderator stats detail (Moderator/Admin)
 */
export async function getModeratorStatsDetailAction() {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "moderator" && session.user.role !== "admin")
    ) {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    return {
      success: true,
      data: {
        stats: {
          pendingReports: 0,
        },
        recentActivity: [],
      },
    };
  } catch (error) {
    console.error("getModeratorStatsDetailAction error:", error);
    return { success: false, error: "Failed to fetch moderator stats" };
  }
}
