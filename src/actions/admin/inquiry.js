"use server";

import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

// Ensure models are registered
const _models = { Inquiry };

/**
 * 📩 Get all inquiries with pagination and filtering
 */
export async function getAdminInquiriesAction({
  page = 1,
  limit = 10,
  status = "",
} = {}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    const query = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [inquiries, total, stats] = await Promise.all([
      Inquiry.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Inquiry.countDocuments(query),
      Inquiry.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            new: { $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] } },
            read: { $sum: { $cond: [{ $eq: ["$status", "read"] }, 1, 0] } },
            archived: { $sum: { $cond: [{ $eq: ["$status", "archived"] }, 1, 0] } },
          },
        },
      ]),
    ]);

    return {
      success: true,
      data: {
        inquiries: JSON.parse(JSON.stringify(inquiries)),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        stats: stats[0] || {
          total: 0,
          new: 0,
          read: 0,
          archived: 0,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to fetch inquiries",
    };
  }
}

/**
 * 🛠️ Update an inquiry (status)
 */
export async function updateInquiryAction(inquiryId, updateData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    const inquiry = await Inquiry.findByIdAndUpdate(inquiryId, updateData, {
      new: true,
    });

    if (!inquiry) {
      return { success: false, error: "Inquiry not found" };
    }

    revalidatePath("/admin/inquiries");
    return { success: true, data: JSON.parse(JSON.stringify(inquiry)) };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to update inquiry",
    };
  }
}
