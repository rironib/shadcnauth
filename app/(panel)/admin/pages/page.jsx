import { UnifiedHeader } from "@/components/panel/unified-header";
import { generateSeoMetadataServer } from "@/lib/seo";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import PagesClient from "./PagesClient";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("admin_pages_page", {
    title: "Pages",
    description: "Manage static pages and content.",
  });
};

export default function Page() {
  return (
    <>
      <UnifiedHeader breadcrumbs={[{ label: "Pages" }]} />
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <PagesClient />
      </Suspense>
    </>
  );
}
