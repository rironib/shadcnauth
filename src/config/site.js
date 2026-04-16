import { env } from "@/lib/validateEnv";

const homeURL = env.NEXT_PUBLIC_BASE_URL;
const siteName = env.NEXT_PUBLIC_SITENAME;

export const siteConfig = {
  name: siteName,
  siteName: siteName,
  title: siteName,
  description:
    "A modern, full-featured authentication and user management system built with Next.js 16, Shadcn UI, and MongoDB.",
  keywords:
    "authentication, next-auth, shadcnui, user management, dashboard, mongodb, nextjs 16",
  baseUrl: homeURL,
  author: siteName,
  locale: "en_US",
  robots: "index, follow",
  icon: `${homeURL}/favicon.ico`,
  fallback: `${homeURL}/images/error.png`,
  socialCover: `${homeURL}/images/cover.webp`,
};
