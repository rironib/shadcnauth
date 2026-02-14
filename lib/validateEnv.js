/**
 * 🌍 Environment Configuration
 * Provides a central object for environment variables with fallbacks.
 */

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const sitename = process.env.NEXT_PUBLIC_SITENAME || "ShadcnUI Auth";

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_URI:
    process.env.DB_URI || process.env.MONGODB_URI || process.env.MONGODB_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || process.env.VERCEL_URL || baseUrl,
  RESEND_API_KEY: process.env.RESEND_API_KEY || process.env.RESEND_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM || `${sitename} <no-reply@shadcnauth.com>`,
  NEXT_PUBLIC_BASE_URL: baseUrl,
  NEXT_PUBLIC_SITENAME: sitename,
  NEXT_PUBLIC_GTM_ID:
    process.env.NEXT_PUBLIC_GTM_ID || process.env.NEXT_PUBLIC_GA_ID,
  GOOGLE_CLIENT_ID:
    process.env.GOOGLE_CLIENT_ID ||
    process.env.GOOGLE_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_ID,
  GOOGLE_CLIENT_SECRET:
    process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_SECRET,
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID || process.env.FACEBOOK_ID,
  FACEBOOK_CLIENT_SECRET:
    process.env.FACEBOOK_CLIENT_SECRET || process.env.FACEBOOK_SECRET,
};
