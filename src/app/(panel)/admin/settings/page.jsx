import { UnifiedHeader } from "@/components/panel/unified-header";
import { generateSeoMetadataServer } from "@/lib/seo";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("admin_settings_page", {
    title: "Site Settings",
    description: "Configure global site settings and preferences.",
  });
};

export default function Page() {
  return (
    <>
      <UnifiedHeader breadcrumbs={[{ label: "Settings" }]} />
      <main className="app-container">
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-zinc-100 pb-6 sm:flex-row sm:items-end dark:border-zinc-900">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
              Settings
            </h1>
            <p className="text-sm text-zinc-500">
              Configure your site settings and global preferences
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "General Settings",
              desc: "Site name, description, timezone, and basic configuration",
            },
            {
              title: "Security Settings",
              desc: "Rate limiting, user permissions, and safety protocols",
            },
            {
              title: "SEO Settings",
              desc: "Meta tags, sitemap, and search engine optimization",
            },
            {
              title: "Email Settings",
              desc: "SMTP configuration and email notifications",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="cursor-pointer space-y-2 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-black dark:hover:border-zinc-700"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed text-zinc-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
