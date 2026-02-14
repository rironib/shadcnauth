import { getSeoById } from "@/actions/admin/seo";
import { generateSeoMetadataServer } from "@/lib/seo";
import EditSeoClient from "./EditSeoClient";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("admin_seo_edit_page", {
    title: "Edit SEO Entry",
    description:
      "Modify SEO metadata and canonical settings for an existing page.",
  });
};

export default async function Page({ params }) {
  const { id } = await params;
  const seoData = await getSeoById(id);

  return <EditSeoClient initialData={seoData} />;
}
