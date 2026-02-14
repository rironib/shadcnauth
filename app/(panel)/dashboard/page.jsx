import DashboardClient from "@/app/(panel)/dashboard/DashboardClient";
import { UnifiedHeader } from "@/components/panel/unified-header";
import { generateSeoMetadataServer } from "@/lib/seo";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("user_dashboard_page", {
    title: "User Dashboard - ShadcnUI Auth",
    description: "Manage your account and settings.",
  });
};

export default function Page() {
  return (
    <>
      <UnifiedHeader breadcrumbs={[{ label: "Overview" }]} />
      <DashboardClient />
    </>
  );
}
