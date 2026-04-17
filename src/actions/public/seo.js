"use server";

import connectDB from "@/lib/db";
import Seo from "@/models/Seo";

// Ensure models are registered
const _models = { Seo };

export async function getSeoByKey(key) {
  if (!key || typeof key !== "string") return null;

  try {
    await connectDB();
    const settings = await Seo.findOne({
      key: key.trim().toLowerCase(),
      isActive: true,
    }).lean();
    return settings ? JSON.parse(JSON.stringify(settings)) : null;
  } catch (error) {
    console.error(`Error fetching SEO by key (${key}):`, error);
    return null;
  }
}
