import { siteConfig } from "@/config/site";

export default function DynamicMetadata({
  title,
  description,
  url,
  type = "website",
  keywords,
  image,
}) {
  const fullTitle = title
    ? `${title} | ${siteConfig.siteName}`
    : siteConfig.siteName;
  const metaDescription = description || siteConfig.description;
  const canonicalUrl = url || siteConfig.baseUrl;
  const ogImage = image || siteConfig.socialCover;

  return (
    <head>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
    </head>
  );
}
