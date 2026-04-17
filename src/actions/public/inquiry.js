"use server";

import connectDB from "@/lib/db";
import Inquiry from "@/models/Inquiry";

// Ensure models are registered
const _models = { Inquiry };

/**
 * 📩 Send an inquiry message
 */
export async function createInquiryAction(data) {
  try {
    const { name, email, subject, message } = data;

    if (!name || !email || !subject || !message) {
      return { success: false, error: "All required fields must be provided." };
    }

    await connectDB();
    const inquiry = await Inquiry.create(data);

    return { success: true, data: JSON.parse(JSON.stringify(inquiry)) };
  } catch (error) {
    return {
      success: false,
      error: error.message || "An error occurred while sending your message.",
    };
  }
}
