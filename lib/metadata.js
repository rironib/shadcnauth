import { siteConfig } from "@/config/site";

export function constructMetadata({
  title,
  description = siteConfig.description,
  keywords = siteConfig.keywords,
  image,
  robots = "index, follow",
  isAbsolute = false,
  link,
} = {}) {
  const {
    siteName,
    baseUrl: siteUrl,
    socialCover: defaultOgImage,
  } = siteConfig;
  const finalImage = image || defaultOgImage;

  const displayTitle = title
    ? isAbsolute || (typeof title === "string" && title.includes(siteName))
      ? title
      : `${title} | ${siteName}`
    : siteName;

  return {
    metadataBase: new URL(siteUrl),
    title: title
      ? { absolute: displayTitle }
      : {
          default: siteName,
          template: `%s | ${siteName}`,
        },
    description,
    keywords: Array.isArray(keywords) ? keywords.join(", ") : keywords,
    alternates: {
      canonical: link,
    },
    openGraph: {
      title: displayTitle,
      description,
      images: [{ url: finalImage }],
      type: "website",
      siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description,
      images: [finalImage],
      creator: siteConfig.links?.twitter
        ? `@${siteConfig.links.twitter.split("/").pop()}`
        : "@yourhandle",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    robots: {
      index: !robots.includes("noindex"),
      follow: !robots.includes("nofollow"),
    },
  };
}
