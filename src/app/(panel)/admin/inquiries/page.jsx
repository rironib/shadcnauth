import { UnifiedHeader } from "@/components/panel/unified-header";
import { generateSeoMetadataServer } from "@/lib/seo";
import InquiriesClient from "./InquiriesClient";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("admin_inquiries_page", {
    title: "User Inquiries",
    description: "Manage inquiries and support requests from users.",
  });
};

export default function Page() {
  return (
    <>
      <UnifiedHeader breadcrumbs={[{ label: "Inquiries" }]} />
      <InquiriesClient />
    </>
  );
}
