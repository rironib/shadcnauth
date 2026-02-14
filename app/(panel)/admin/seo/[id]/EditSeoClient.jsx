"use client";

import { updateSeoSettings } from "@/actions/admin/seo";
import SeoForm from "@/components/admin/seo/seo-form";
import { UnifiedHeader } from "@/components/panel/unified-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function EditSeoClient({ initialData }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      if (!initialData?._id) return;
      setIsLoading(true);

      const result = await updateSeoSettings(initialData._id, data);

      if (!result.success) {
        throw new Error(result.error || "Failed to update SEO entry");
      }

      toast.success("SEO entry updated successfully");
      router.push("/admin/seo");
    } catch (error) {
      console.error("Error updating SEO entry:", error);
      toast.error(error.message || "Failed to create SEO entry");
    } finally {
      setIsLoading(false);
    }
  };

  if (!initialData) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 p-8 dark:bg-zinc-950">
        <div className="space-y-4 rounded-lg border border-red-200 bg-white p-8 text-center dark:border-red-900 dark:bg-black">
          <p className="font-bold text-red-500">SEO entry not found</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/seo")}
          >
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <UnifiedHeader
        breadcrumbs={[
          { label: "SEO", href: "/admin/seo" },
          { label: "Edit Entry" },
        ]}
      />
      <SeoForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isEdit={true}
      />
    </>
  );
}
