import { MarkdownRenderer } from "@/components/app/markdown-renderer";
import connectDB from "@/lib/db";
import Page from "@/models/Page";
import { format } from "date-fns";
import * as LucideIcons from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  await connectDB();
  const { slug } = await params;
  const page = await Page.findOne({ slug, status: "published" });

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription || page.excerpt,
    keywords: page.seo?.keywords || [],
  };
}

export default async function DynamicPage({ params }) {
  await connectDB();
  const { slug } = await params;
  const page = await Page.findOne({ slug, status: "published" });

  if (!page) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {page.featuredImage && (
        <div className="relative aspect-[21/9] overflow-hidden rounded-2xl border shadow-sm">
          <Image
            src={page.featuredImage}
            alt={page.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* 2 & 3. Title and Date */}
      <div className="space-y-4 text-left">
        <h1 className="text-3xl leading-tight font-black tracking-tighter text-foreground md:text-5xl">
          {page.title}
        </h1>
        <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-muted-foreground/60 uppercase">
          <LucideIcons.Calendar className="h-3.5 w-3.5" />
          <span>
            Last Updated:{" "}
            {format(
              new Date(page.updatedAt || page.createdAt),
              "MMMM dd, yyyy",
            )}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="p-6 text-left md:p-10 lg:p-12">
          <MarkdownRenderer
            content={page.content}
            className="md:prose-base prose-headings:font-black prose-headings:tracking-tighter prose-a:text-primary prose-a:no-underline hover:prose-a:underline leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
