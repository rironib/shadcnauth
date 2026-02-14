import { getSeoSettings } from "@/actions/admin/seo";
import { UnifiedHeader } from "@/components/panel/unified-header";
import { generateSeoMetadataServer } from "@/lib/seo";
import SeoManagementClient from "./SeoManagementClient";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("admin_seo_page", {
    title: "SEO Management",
    description: "Configure and manage SEO metadata for all community pages.",
  });
};

export default async function Page() {
  const { settings } = await getSeoSettings();

  return (
    <>
      <UnifiedHeader breadcrumbs={[{ label: "SEO" }]} />
      <SeoManagementClient initialData={settings || []} />
    </>
  );
}
