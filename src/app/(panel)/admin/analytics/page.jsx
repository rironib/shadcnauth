import { UnifiedHeader } from "@/components/panel/unified-header";
import { generateSeoMetadataServer } from "@/lib/seo";
import AnalyticsClient from "./AnalyticsClient";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("admin_analytics_page", {
    title: "Analytics",
    description: "View community statistics and trends.",
  });
};

export default function Page() {
  return (
    <>
      <UnifiedHeader breadcrumbs={[{ label: "Analytics" }]} />
      <main className="app-container">
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-zinc-100 pb-6 sm:flex-row sm:items-end dark:border-zinc-900">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
              Analytics
            </h1>
            <p className="text-sm text-zinc-500">
              Temporal analysis and system signal telemetry
            </p>
          </div>
        </div>
        <AnalyticsClient />
      </main>
    </>
  );
}
