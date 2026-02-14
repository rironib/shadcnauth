import { UnifiedHeader } from "@/components/panel/unified-header";
import { generateSeoMetadataServer } from "@/lib/seo";
import ActivityClient from "./ActivityClient";

export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("moderator_activity", {
    title: "Moderation Logs - ShadcnUI Auth",
    description: "Audit trails of all moderation actions.",
  });
};

export default function ActivityLogsPage() {
  return (
    <>
      <UnifiedHeader 
        breadcrumbs={[
          { label: "Moderator", href: "/moderator" },
          { label: "Activity Logs" }
        ]} 
      />
      <ActivityClient />
    </>
  );
}
