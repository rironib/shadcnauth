"use server";

import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";

// Ensure models are registered
const _models = { Contact };

/**
 * 📩 Send a contact message
 */
export async function createContactAction(data) {
  try {
    const { name, email, subject, message } = data;

    if (!name || !email || !subject || !message) {
      return { success: false, error: "All required fields must be provided." };
    }

    await connectDB();
    const contact = await Contact.create(data);

    return { success: true, data: JSON.parse(JSON.stringify(contact)) };
  } catch (error) {
    return {
      success: false,
      error: error.message || "An error occurred while sending your message.",
    };
  }
}
