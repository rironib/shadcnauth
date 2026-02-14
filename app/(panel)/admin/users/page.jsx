import { UnifiedHeader } from "@/components/panel/unified-header";
import { generateSeoMetadataServer } from "@/lib/seo";
import MembersClient from "./MembersClient";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("admin_members_page", {
    title: "Member Management",
    description: "View and manage all forum members.",
  });
};

export default function Page() {
  return (
    <>
      <UnifiedHeader breadcrumbs={[{ label: "Members" }]} />
      <MembersClient />
    </>
  );
}
