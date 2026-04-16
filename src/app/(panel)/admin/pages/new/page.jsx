import { generateSeoMetadataServer } from "@/lib/seo";
import NewPageClient from "./NewPageClient";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("admin_pages_new_page", {
    title: "Create CMS Page",
    description: "Add a new static page to the website.",
  });
};

export default function Page() {
  return <NewPageClient />;
}
