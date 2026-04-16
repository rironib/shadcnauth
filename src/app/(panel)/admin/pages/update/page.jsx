import { generateSeoMetadataServer } from "@/lib/seo";
import UpdatePageClient from "./UpdatePageClient";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("admin_pages_update_page", {
    title: "Update CMS Page",
    description: "Modify existing static page content and settings.",
  });
};

export default function Page() {
  return <UpdatePageClient />;
}
