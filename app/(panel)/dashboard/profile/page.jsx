import { UnifiedHeader } from "@/components/panel/unified-header";
import { generateSeoMetadataServer } from "@/lib/seo";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("user_profile_page", {
    title: "My Profile",
    description: "View and manage your public profile.",
  });
};

import ProfileViewClient from "./ProfileViewClient";
export default function Page() {
  return (
    <>
      <UnifiedHeader breadcrumbs={[{ label: "Profile" }]} />
      <ProfileViewClient />
    </>
  );
}
