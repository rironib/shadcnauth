import { getSeoByKey } from "@/actions/public/seo";
import { seoRoutes } from "@/config/routes";
import { constructMetadata } from "./metadata";

/**
 * 🚀 Server-side SEO Metadata Generator
 * Fetches dynamic SEO overrides from MongoDB and merges them with page defaults.
 */
export async function generateSeoMetadataServer(key, fallbacks = {}) {
  const customSeo = await getSeoByKey(key);
  const defaultLink = seoRoutes[key] || fallbacks.link;

  return constructMetadata({
    title: customSeo?.title || fallbacks.title,
    description: customSeo?.description || fallbacks.description,
    keywords: customSeo?.keywords || fallbacks.keywords,
    image: customSeo?.cover || fallbacks.image,
    robots: customSeo?.robots || fallbacks.robots,
    isAbsolute: !!fallbacks.isAbsolute,
    link: customSeo?.link || defaultLink,
  });
}
