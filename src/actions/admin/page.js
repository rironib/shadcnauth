"use server";

import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Page from "@/models/Page";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

// Ensure models are registered
const _models = { Page, User };

/**
 * 📄 Get all pages (Admin)
 */
export async function getAdminPagesAction(page = 1, limit = 20) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();
    const skip = (page - 1) * limit;

    const [pages, total] = await Promise.all([
      Page.find({ status: { $ne: "deleted" } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("authorId", "name email")
        .lean(),
      Page.countDocuments({ status: { $ne: "deleted" } }),
    ]);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(pages)),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("getAdminPagesAction error:", error);
    return { success: false, error: "Failed to fetch pages" };
  }
}

/**
 * 📄 Create a new static page (Admin)
 */
export async function createPageAction(data) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    if (!data.title || !data.content || !data.slug) {
      return {
        success: false,
        error: "Title, slug, and content are required.",
      };
    }

    const existingPage = await Page.findOne({ slug: data.slug });
    if (existingPage) {
      return { success: false, error: "Slug already exists." };
    }

    const newPage = await Page.create({
      ...data,
      authorId: session.user.id,
    });

    revalidatePath("/admin/pages");
    revalidatePath(`/page/${data.slug}`);

    return { success: true, data: JSON.parse(JSON.stringify(newPage)) };
  } catch (error) {
    console.error("createPageAction error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 📄 Update a static page (Admin)
 */
export async function updatePageAction(id, data) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    if (data.slug) {
      const existingPage = await Page.findOne({
        slug: data.slug,
        _id: { $ne: id },
      });
      if (existingPage) {
        return { success: false, error: "Slug already exists." };
      }
    }

    const page = await Page.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!page) return { success: false, error: "Page not found" };

    revalidatePath("/admin/pages");
    revalidatePath(`/page/${page.slug}`);

    return { success: true, data: JSON.parse(JSON.stringify(page)) };
  } catch (error) {
    console.error("updatePageAction error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 📄 Delete a static page (Admin)
 */
export async function deletePageAction(id) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();
    const page = await Page.findByIdAndDelete(id);
    if (!page) return { success: false, error: "Page not found" };

    revalidatePath("/admin/pages");

    return { success: true, message: "Page deleted successfully" };
  } catch (error) {
    console.error("deletePageAction error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 📄 Get single page by ID (Admin)
 */
export async function getAdminPageByIdAction(id) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();
    const page = await Page.findById(id).lean();
    if (!page) return { success: false, error: "Page not found" };

    return { success: true, data: JSON.parse(JSON.stringify(page)) };
  } catch (error) {
    console.error("getAdminPageByIdAction error:", error);
    return { success: false, error: "Failed to fetch page" };
  }
}
