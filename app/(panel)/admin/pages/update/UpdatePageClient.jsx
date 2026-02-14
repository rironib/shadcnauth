"use client";

import { getAdminPageByIdAction } from "@/actions/admin/page";
import PageForm from "@/components/admin/pages/page-form";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

function UpdatePageForm() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPage(id);
    }
  }, [id]);

  const fetchPage = async (pageId) => {
    try {
      const result = await getAdminPageByIdAction(pageId);
      if (result.success) {
        setPage(result.data);
      } else {
        toast.error(result.error || "Failed to fetch page details");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          <p className="text-sm text-zinc-500">Loading page editor...</p>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Page not found</h1>
          <p className="mt-2 text-sm text-zinc-500">
            The requested page could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return <PageForm initialData={page} isEdit={true} />;
}

export default function UpdatePageClient() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            <p className="text-sm text-zinc-500">Loading page editor...</p>
          </div>
        </div>
      }
    >
      <UpdatePageForm />
    </Suspense>
  );
}
