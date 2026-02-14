"use client";

import { saveSeoSettings } from "@/actions/admin/seo";
import SeoForm from "@/components/admin/seo/seo-form";
import { UnifiedHeader } from "@/components/panel/unified-header";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewSeoClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);

      const result = await saveSeoSettings(data);

      if (!result.success) {
        throw new Error(result.error || "Failed to create SEO entry");
      }

      toast.success("SEO entry created successfully");
      router.push("/admin/seo");
    } catch (error) {
      console.error("Error creating SEO entry:", error);
      toast.error(error.message || "Failed to create SEO entry");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <UnifiedHeader
        breadcrumbs={[
          { label: "SEO", href: "/admin/seo" },
          { label: "New Entry" },
        ]}
      />
      <SeoForm onSubmit={handleSubmit} isLoading={isLoading} isEdit={false} />
    </>
  );
}
