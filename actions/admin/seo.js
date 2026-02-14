"use server";

import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Seo from "@/models/Seo";
import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";

// Ensure models are registered
const _models = { Seo };

/**
 * 🔒 Middleware check for Admin access
 */
async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
  return session.user;
}

/**
 * 🔍 Get SEO settings for all items
 */
export async function getSeoSettings() {
  try {
    await checkAdmin();
    await connectDB();
    const settings = await Seo.find().sort({ key: 1 }).lean();
    return { success: true, settings: JSON.parse(JSON.stringify(settings)) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 🔍 Get SEO settings by ID
 */
export async function getSeoById(id) {
  if (!id || typeof id !== "string") return null;

  try {
    await checkAdmin();
    await connectDB();
    const settings = await Seo.findById(id).lean();
    return settings ? JSON.parse(JSON.stringify(settings)) : null;
  } catch (error) {
    console.error(`Error fetching SEO by ID (${id}):`, error);
    return null;
  }
}

/**
 * ➕ Save SEO settings (Create or Update)
 */
export async function saveSeoSettings(data) {
  try {
    const user = await checkAdmin();
    await connectDB();

    const { key, link, title, description, keywords, cover, robots, isActive } =
      data;
    const normalizedKey = key.toLowerCase().trim();

    const settings = await Seo.findOneAndUpdate(
      { key: normalizedKey },
      { link, title, description, keywords, cover, robots, isActive },
      { new: true, upsert: true },
    );

    revalidatePath("/dashboard/admin/seo");

    return { success: true, settings: JSON.parse(JSON.stringify(settings)) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * ✏️ Update SEO settings by ID
 */
export async function updateSeoSettings(id, data) {
  try {
    const user = await checkAdmin();
    await connectDB();

    const { key, link, title, description, keywords, cover, robots, isActive } =
      data;
    const normalizedKey = key.toLowerCase().trim();

    // Check if key exists for OTHER entry
    const existing = await Seo.findOne({
      key: normalizedKey,
      _id: { $ne: id },
    });
    if (existing) {
      throw new Error("Key already exists");
    }

    const settings = await Seo.findByIdAndUpdate(
      id,
      {
        key: normalizedKey,
        link,
        title,
        description,
        keywords,
        cover,
        robots,
        isActive,
      },
      { new: true, runValidators: true },
    );

    if (!settings) throw new Error("Settings not found");

    revalidatePath("/dashboard/admin/seo");

    return { success: true, settings: JSON.parse(JSON.stringify(settings)) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 🗑️ Delete SEO settings
 */
export async function deleteSeoSettings(id) {
  try {
    const user = await checkAdmin();
    await connectDB();

    const settings = await Seo.findByIdAndDelete(id);
    if (!settings) throw new Error("Settings not found");

    revalidatePath("/dashboard/admin/seo");

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
