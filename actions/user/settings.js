"use server";

import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { compare, hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

// Ensure models are registered
const _models = { User };

export async function changePassword(prevState, formData) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { error: "You must be logged in to change your password" };
    }

    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { error: "All fields are required" };
    }

    if (newPassword !== confirmPassword) {
      return { error: "New passwords do not match" };
    }

    if (newPassword.length < 8) {
      return { error: "Password must be at least 8 characters long" };
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email }).select(
      "+password",
    );

    if (!user) {
      return { error: "User not found" };
    }

    const isMatch = await compare(currentPassword, user.password);

    if (!isMatch) {
      return { error: "Incorrect current password" };
    }

    const hashedPassword = await hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    revalidatePath("/dashboard/settings");

    return { success: "Password updated successfully" };
  } catch (error) {
    console.error("Change password error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function deleteAccount() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: "You must be logged in to delete your account" };
    }

    await connectDB();

    const user = await User.findById(session.user.id);

    if (!user) {
      return { error: "User not found" };
    }

    user.status = "deleted";
    await user.save();

    return { success: "Account marked for deletion." };
  } catch (error) {
    console.error("Delete account error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
