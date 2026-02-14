"use server";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// Ensure models are registered
const _models = { User };

export async function getMembers(
  page = 1,
  limit = 20,
  sort = "newest",
  role = "all",
) {
  try {
    await connectDB();

    const query = {
      status: "active",
      ...(role !== "all" && { role }),
    };

    let sortOption = { createdAt: -1 };

    // Sort logic removed for top_liked

    const skip = (page - 1) * limit;

    const [members, total] = await Promise.all([
      User.find(query)
        .select("name username bio lastActive role createdAt")
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    return {
      success: true,
      members: JSON.parse(JSON.stringify(members)),
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  } catch (error) {
    console.error("Error fetching members:", error);
    return {
      success: false,
      members: [],
      pagination: { total: 0, pages: 0, currentPage: 1 },
    };
  }
}
