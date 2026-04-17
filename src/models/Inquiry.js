import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema(
  {
    // 👤 Sender Info
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },

    // 📩 Message Content
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },

    // ⚙️ Status
    status: {
      type: String,
      enum: ["new", "read", "archived"],
      default: "new",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "inquiries",
  },
);

// Index for fast lookup
InquirySchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Inquiry ||
  mongoose.model("Inquiry", InquirySchema);
