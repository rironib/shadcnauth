import { generateSeoMetadataServer } from "@/lib/seo";
import SettingsClient from "./SettingsClient";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("user_settings_page", {
    title: "Account Settings",
    description: "Manage your account preferences and security settings.",
  });
};

import { UnifiedHeader } from "@/components/panel/unified-header";

export default function Page() {
  return (
    <>
      <UnifiedHeader
        breadcrumbs={[
          { label: "Overview", href: "/dashboard" },
          { label: "Settings" },
        ]}
      />
      <SettingsClient />
    </>
  );
}
