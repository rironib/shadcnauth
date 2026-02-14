import { UnifiedHeader } from "@/components/panel/unified-header";
import { generateSeoMetadataServer } from "@/lib/seo";
import AdminDashboardClient from "./AdminDashboardClient";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("admin_dashboard_page", {
    title: "Admin Dashboard - ShadcnUI Auth",
    description:
      "Admin control panel for managing reports and system settings.",
  });
};

export default function Page() {
  return (
    <>
      <UnifiedHeader breadcrumbs={[{ label: "Dashboard" }]} />
      <AdminDashboardClient />
    </>
  );
}
