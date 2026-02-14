"use server";

import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

// Ensure models are registered
const _models = { User };

/**
 * 👥 Get members with pagination (Admin)
 */
export async function getAdminMembersAction({
  page = 1,
  limit = 20,
  role = "",
  status = "",
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    const query = {};
    if (role) query.role = role;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [members, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(query),
    ]);

    // Summary stats for header
    const [totalMembers, activeToday, banned, newThisWeek] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({
        lastActive: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      User.countDocuments({ status: "banned" }),
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    return {
      success: true,
      data: {
        members: JSON.parse(JSON.stringify(members)),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        stats: {
          totalMembers,
          activeToday,
          banned,
          newThisWeek,
        },
      },
    };
  } catch (error) {
    console.error("getAdminMembersAction error:", error);
    return { success: false, error: "Failed to fetch members" };
  }
}

/**
 * 👥 Update member role or status (Admin)
 */
export async function updateMemberAction(userId, data) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });
    if (!user) return { success: false, error: "Member not found" };

    revalidatePath("/admin/users");
    revalidatePath(`/user/${user.username}`);

    return { success: true, data: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    console.error("updateMemberAction error:", error);
    return { success: false, error: "Failed to update member" };
  }
}

/**
 * 👥 Delete member (Admin)
 */
export async function deleteMemberAction(userId) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    if (session.user.id === userId) {
      return { success: false, error: "You cannot delete your own account" };
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) return { success: false, error: "Member not found" };

    revalidatePath("/admin/users");

    return { success: true, message: "Member deleted successfully" };
  } catch (error) {
    console.error("deleteMemberAction error:", error);
    return { success: false, error: "Failed to delete member" };
  }
}
