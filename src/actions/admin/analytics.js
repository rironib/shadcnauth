"use server";

import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";

import Contact from "@/models/Contact";
import Page from "@/models/Page";
import User from "@/models/User";
import { getServerSession } from "next-auth";

// Ensure models are registered
const _models = {
  Contact,
  Page,
  User,
};

/**
 * 📈 Get site analytics and engine pulse (Admin)
 */
export async function getAdminAnalyticsAction(range = "30", tz = "Asia/Dhaka") {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    const tzOffset = 6 * 60; // Dhaka +6 (simplified default)
    let days = parseInt(range);
    if (isNaN(days)) days = 30;
    if (range === "today") days = 1;

    const now = new Date();
    const getStartOfTzDay = (date, offsetMin, daysAgo = 0) => {
      const d = new Date(date.getTime() + offsetMin * 60000);
      d.setUTCHours(0, 0, 0, 0);
      d.setUTCDate(d.getUTCDate() - daysAgo);
      return new Date(d.getTime() - offsetMin * 60000);
    };

    const startDateMatch = getStartOfTzDay(
      now,
      tzOffset,
      range === "today" ? 0 : days - 1,
    );

    const models = {
      users: User,
      pages: Page,
      contacts: Contact,
    };

    const modelKeys = Object.keys(models);

    const getGroupedData = async (Model) => {
      const items = await Model.find(
        { createdAt: { $gte: startDateMatch } },
        "createdAt",
      ).lean();
      const grouped = {};
      items.forEach((item) => {
        if (!item.createdAt) return;
        const d = new Date(
          new Date(item.createdAt).getTime() + tzOffset * 60000,
        );
        const y = d.getUTCFullYear();
        const m = (d.getUTCMonth() + 1).toString().padStart(2, "0");
        const day = d.getUTCDate().toString().padStart(2, "0");
        let key =
          range === "today"
            ? `${y}-${m}-${day} ${d.getUTCHours().toString().padStart(2, "0")}:00`
            : `${y}-${m}-${day}`;
        grouped[key] = (grouped[key] || 0) + 1;
      });
      return grouped;
    };

    const aggResults = await Promise.all(
      modelKeys.map((key) => getGroupedData(models[key])),
    );
    const results = {};
    modelKeys.forEach((key, i) => (results[key] = aggResults[i]));

    const chartData = [];
    const totalBuckets = range === "today" ? 24 : days;
    const loopStart = new Date(startDateMatch.getTime() + tzOffset * 60000);

    for (let i = 0; i < totalBuckets; i++) {
      const d = new Date(loopStart);
      if (range === "today") d.setUTCHours(i);
      else d.setUTCDate(d.getUTCDate() + i);
      const y = d.getUTCFullYear();
      const m = (d.getUTCMonth() + 1).toString().padStart(2, "0");
      const day = d.getUTCDate().toString().padStart(2, "0");
      let finalId =
        range === "today"
          ? `${y}-${m}-${day} ${d.getUTCHours().toString().padStart(2, "0")}:00`
          : `${y}-${m}-${day}`;
      const dataPoint = { date: finalId };
      modelKeys.forEach((key) => (dataPoint[key] = results[key][finalId] || 0));
      chartData.push(dataPoint);
    }

    const statsCounts = await Promise.all([
      User.countDocuments(),
      Page.countDocuments(),
      Contact.countDocuments(),
      User.countDocuments({ status: { $in: ["banned", "suspended"] } }),
      User.countDocuments({ emailVerified: null }),
    ]);

    return {
      success: true,
      data: {
        chartData,
        stats: {
          totalUsers: statsCounts[0],
          totalPages: statsCounts[1],
          totalContacts: statsCounts[2],
          bannedUsers: statsCounts[3],
          unverifiedUsers: statsCounts[4],
        },
      },
    };
  } catch (error) {
    console.error("getAdminAnalyticsAction error:", error);
    return { success: false, error: "Failed to fetch analytics" };
  }
}
