"use client";

import { createPageAction, updatePageAction } from "@/actions/admin/page";
import { UnifiedHeader } from "@/components/panel/unified-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function PageForm({ initialData, isEdit }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    status: initialData?.status || "draft",
    featuredImage: initialData?.featuredImage || "",
    seo: {
      metaTitle: initialData?.seo?.metaTitle || "",
      metaDescription: initialData?.seo?.metaDescription || "",
      keywords: initialData?.seo?.keywords?.join(", ") || "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title" && !isEdit && !formData.slug) {
      // Auto-generate slug from title if creating and slug is empty
      setFormData((prev) => ({
        ...prev,
        title: value,
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, ""),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSeoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      seo: { ...prev.seo, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        seo: {
          ...formData.seo,
          keywords: formData.seo.keywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k),
        },
      };

      let result;
      if (isEdit) {
        result = await updatePageAction(initialData._id, payload);
      } else {
        result = await createPageAction(payload);
      }

      if (result.success) {
        toast.success(
          isEdit ? "Page updated successfully" : "Page created successfully",
        );
        router.push("/admin/pages");
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setFormData((prev) => ({ ...prev, status: "draft" }));
    setTimeout(() => {
      document.getElementById("page-form").requestSubmit();
    }, 100);
  };

  const handlePublish = async () => {
    setFormData((prev) => ({ ...prev, status: "published" }));
    setTimeout(() => {
      document.getElementById("page-form").requestSubmit();
    }, 100);
  };

  return (
    <>
      <UnifiedHeader
        breadcrumbs={[
          { label: "Pages", href: "/admin/pages" },
          { label: isEdit ? "Edit Page" : "New Page" },
        ]}
      />
      <main className="app-container">
        <form id="page-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            {/* Main Content Area */}
            <div className="space-y-4">
              {/* Title */}
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-black">
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter title here"
                  className="h-16 rounded-none border-0 px-6 text-2xl font-bold placeholder:text-zinc-300 focus-visible:ring-0 dark:placeholder:text-zinc-700"
                />
              </div>

              {/* Permalink */}
              <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="font-medium">Permalink:</span>
                  <span className="text-zinc-400">/pages/</span>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    placeholder="page-slug"
                    className="inline-flex h-6 w-auto min-w-[200px] border-zinc-300 px-2 text-xs dark:border-zinc-700"
                  />
                </div>
              </div>

              {/* Content Editor */}
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
                <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900">
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Content (Markdown)
                  </span>
                </div>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  className="min-h-[500px] resize-none rounded-none border-0 font-mono text-sm focus-visible:ring-0"
                  placeholder="# Heading&#10;&#10;Write your content here using Markdown..."
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Publish Box */}
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
                <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Publish
                  </h3>
                </div>
                <div className="space-y-4 p-4">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {isEdit
                        ? `Last modified: ${new Date(initialData?.updatedAt).toLocaleDateString()}`
                        : "Not published yet"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-xs font-medium">
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 flex-1 text-xs"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading && (
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      )}
                      {isEdit ? "Update" : "Publish"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
                <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Featured Image
                  </h3>
                </div>
                <div className="space-y-3 p-4">
                  {formData.featuredImage && (
                    <div className="relative aspect-video overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.featuredImage}
                        alt="Featured"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label
                      htmlFor="featuredImage"
                      className="text-xs font-medium"
                    >
                      Image URL
                    </Label>
                    <Input
                      id="featuredImage"
                      name="featuredImage"
                      value={formData.featuredImage}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* SEO Settings */}
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
                <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    SEO Settings
                  </h3>
                </div>
                <div className="space-y-4 p-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="metaDescription"
                      className="text-xs font-medium"
                    >
                      Meta Description
                    </Label>
                    <Textarea
                      id="metaDescription"
                      name="metaDescription"
                      value={formData.seo.metaDescription}
                      onChange={handleSeoChange}
                      placeholder="Brief description for search engines"
                      className="min-h-[80px] text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keywords" className="text-xs font-medium">
                      Keywords (comma separated)
                    </Label>
                    <Input
                      id="keywords"
                      name="keywords"
                      value={formData.seo.keywords}
                      onChange={handleSeoChange}
                      placeholder="react, nextjs, tutorial"
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
