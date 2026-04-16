import { UnifiedHeader } from "@/components/panel/unified-header";
import { generateSeoMetadataServer } from "@/lib/seo";
import ModeratorDashboardClient from "./ModeratorDashboardClient";

export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("moderator_overview", {
    title: "Moderator Dashboard - ShadcnUI Auth",
    description: "Moderator dashboard overview and quick actions.",
  });
};

export default function ModeratorDashboard() {
  return (
    <>
      <UnifiedHeader breadcrumbs={[{ label: "Dashboard" }]} />
      <ModeratorDashboardClient />
    </>
  );
}
