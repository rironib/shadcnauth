import mongoose from "mongoose";

const seoSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    link: {
      type: String,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    keywords: {
      type: String,
      trim: true,
    },
    cover: {
      type: String,
      trim: true,
    },
    robots: {
      type: String,
      default: "index, follow",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false, collection: "seo" },
);

const Seo = mongoose.models.Seo || mongoose.model("Seo", seoSchema);

export default Seo;
