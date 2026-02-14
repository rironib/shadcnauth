import { generateSeoMetadataServer } from "@/lib/seo";
import NewSeoClient from "./NewSeoClient";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("admin_seo_new_page", {
    title: "Create SEO Entry - Admin Dashboard",
    description:
      "Define metadata and search engine indexing rules for a new community page.",
  });
};

export default function Page() {
  return <NewSeoClient />;
}
