import { generateSeoMetadataServer } from "@/lib/seo";
import EditProfileClient from "./EditProfileClient";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("user_profile_edit_page", {
    title: "Edit Profile",
    description:
      "Update your forum bio, country, website, and social media links.",
  });
};

import { UnifiedHeader } from "@/components/panel/unified-header";

export default function Page() {
  return (
    <>
      <UnifiedHeader
        breadcrumbs={[
          { label: "Profile", href: "/dashboard/profile" },
          { label: "Edit Profile" },
        ]}
      />
      <EditProfileClient />
    </>
  );
}
