import { siteConfig } from "@/config/site";
import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";
import User from "@/models/User";

export default async function sitemap() {
  await connectDB();
  const baseUrl = siteConfig.baseUrl;

  // Static routes
  const routes = ["", "/login", "/register", "/page/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.8,
  }));

  // Fetch Users (Active only)
  const users = await User.find({ status: "active" })
    .select("username updatedAt")
    .sort({ updatedAt: -1 })
    .lean();

  const userRoutes = users.map((user) => ({
    url: `${baseUrl}/user/${user.username}`,
    lastModified: user.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Fetch Pages (Published only)
  const pages = await Page.find({ status: "published" })
    .select("slug updatedAt")
    .sort({ updatedAt: -1 })
    .lean();

  const pageRoutes = pages.map((page) => ({
    url: `${baseUrl}/page/${page.slug}`,
    lastModified: page.updatedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...routes, ...userRoutes, ...pageRoutes];
}
