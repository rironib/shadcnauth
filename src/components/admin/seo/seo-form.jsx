"use client";

import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Loader2, X } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

export default function SeoForm({ initialData, onSubmit, isLoading, isEdit }) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: initialData || {
      pageKey: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: [],
      metaImage: "",
      twitterCard: "summary_large_image",
      canonicalUrl: "",
      robots: "index, follow",
      isActive: true,
    },
  });

  // Ensure metaKeywords is always an array
  useEffect(() => {
    if (initialData && !Array.isArray(initialData.metaKeywords)) {
      setValue("metaKeywords", []);
    } else if (!initialData) {
      setValue("metaKeywords", []);
    }
  }, [initialData, setValue]);

  const keywords =
    useWatch({
      control,
      name: "metaKeywords",
    }) || [];

  const metaDescription =
    useWatch({
      control,
      name: "metaDescription",
    }) || "";

  const removeKeyword = (index) => {
    const updatedKeywords = keywords.filter((_, i) => i !== index);
    setValue("metaKeywords", updatedKeywords, { shouldDirty: true });
  };

  const handleKeywordKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = e.target.value.trim().replace(/,+$/, "");
      if (value) {
        // Handle multiple keywords if pasted with commas
        const newKeywords = value
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k !== "" && !keywords.includes(k));

        if (newKeywords.length > 0) {
          setValue("metaKeywords", [...keywords, ...newKeywords], {
            shouldDirty: true,
          });
        }
        e.target.value = "";
      }
    }
  };

  return (
    <main className="app-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main Content Area */}
          <div className="space-y-4">
            {/* Meta Title */}
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-black">
              <Input
                id="metaTitle"
                {...register("metaTitle", {
                  required: "Page title is required",
                })}
                required
                placeholder="Enter SEO title here"
                className="h-16 rounded-none border-0 px-6 text-2xl font-bold placeholder:text-zinc-300 focus-visible:ring-0 dark:placeholder:text-zinc-700"
              />
            </div>

            {/* Description Card */}
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
              <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Meta Description
                </span>
              </div>
              <Textarea
                id="metaDescription"
                {...register("metaDescription", {
                  required: "Meta description is required",
                  maxLength: { value: 160, message: "Max 160 chars" },
                })}
                className="min-h-[120px] resize-none rounded-none border-0 p-6 text-sm focus-visible:ring-0"
                placeholder="Brief summary for search engine results..."
              />
              <div className="flex justify-between border-t border-zinc-100 bg-zinc-50/50 px-6 py-2 dark:border-zinc-900">
                {errors.metaDescription && (
                  <p className="font-mono text-[10px] text-red-500">
                    {errors.metaDescription.message}
                  </p>
                )}
                <p
                  className={`ml-auto font-mono text-[10px] ${metaDescription.length > 160 ? "text-red-500" : "text-zinc-400"}`}
                >
                  {metaDescription.length}/160 CHARS
                </p>
              </div>
            </div>

            {/* Advanced SEO Config */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="pageKey"
                      className="text-xs font-medium tracking-widest text-zinc-500 uppercase"
                    >
                      Page Key
                    </Label>
                    <Input
                      id="pageKey"
                      placeholder="e.g. home_page"
                      {...register("pageKey", {
                        required: "Page key is required",
                      })}
                      className="h-10 font-mono text-xs"
                    />
                    {errors.pageKey && (
                      <p className="text-[10px] text-red-500">
                        {errors.pageKey.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="canonicalUrl"
                      className="text-xs font-medium tracking-widest text-zinc-500 uppercase"
                    >
                      Canonical URL
                    </Label>
                    <Input
                      id="canonicalUrl"
                      placeholder="https://..."
                      {...register("canonicalUrl")}
                      className="h-10 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Social Graph Card */}
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
                <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900">
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Social Graph (OG)
                  </span>
                </div>
                <div className="space-y-4 p-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="metaImage"
                        className="text-xs font-medium"
                      >
                        OG Image URL
                      </Label>
                      <Input
                        id="metaImage"
                        {...register("metaImage")}
                        placeholder="https://..."
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="twitterCard"
                        className="text-xs font-medium"
                      >
                        Twitter Card
                      </Label>
                      <Controller
                        name="twitterCard"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="h-9 text-xs">
                              <SelectValue placeholder="Select card type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="summary_large_image">
                                Summary Large Image
                              </SelectItem>
                              <SelectItem value="summary">Summary</SelectItem>
                              <SelectItem value="app">App</SelectItem>
                              <SelectItem value="player">Player</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Publish Box */}
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
              <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Publish Changes
                </h3>
              </div>
              <div className="space-y-4 p-4">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {isEdit ? "Last modified: System" : "Not synchronized"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-md bg-zinc-50 p-2 dark:bg-zinc-900">
                  <span className="text-xs font-medium">Status</span>
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading && (
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    )}
                    {isEdit ? "Update SEO" : "Create SEO"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Keywords Sidebar Box */}
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
              <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Keywords
                </h3>
              </div>
              <div className="space-y-4 p-4">
                <Input
                  placeholder="Add keyword & Enter..."
                  onKeyDown={handleKeywordKeyDown}
                  className="h-9 text-xs"
                />
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="rounded px-2 py-0.5 font-mono text-[10px]"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(index)}
                        className="ml-1 text-zinc-400 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {keywords.length === 0 && (
                    <p className="text-[10px] text-zinc-400">
                      No keywords defined.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Indexing Sidebar Box */}
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
              <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Robots
                </h3>
              </div>
              <div className="p-4">
                <Controller
                  name="robots"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select robots" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="index, follow">
                          Index, Follow
                        </SelectItem>
                        <SelectItem value="noindex, follow">
                          No Index, Follow
                        </SelectItem>
                        <SelectItem value="index, nofollow">
                          Index, No Follow
                        </SelectItem>
                        <SelectItem value="noindex, nofollow">
                          No Index, No Follow
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
