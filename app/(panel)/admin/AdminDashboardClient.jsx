"use client";

import { getAdminDashboardStatsAction } from "@/actions/admin/stats";
import { ArrowRight, FileText, LayoutGrid, Search, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboardClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAdminDashboardStatsAction();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error);
        }
      } catch (error) {
        console.error("Failed to fetch admin dashboard data", error);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse p-4 text-center text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <h3 className="font-bold">Failed to load dashboard data</h3>
        <p className="text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-xs underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <main className="app-container">
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-zinc-100 pb-6 sm:flex-row sm:items-end dark:border-zinc-900">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
            Admin Dashboard
          </h1>
          <p className="text-sm text-zinc-500">
            System control panel and global site analytics
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-2 md:gap-4 lg:grid-cols-1 lg:gap-6">
        <div className="group space-y-1 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:bg-black dark:hover:border-zinc-600">
          <p className="font-mono text-[10px] leading-none tracking-widest text-zinc-400 uppercase">
            Members
          </p>
          <div className="text-3xl leading-tight font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {data.stats.totalUsers}
          </div>
          <p className="text-[10px] font-medium text-zinc-500">
            Registered users
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-7 lg:gap-10">
        {/* System Overview */}
        <div className="space-y-4 md:space-y-6 lg:col-span-4 lg:space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-sm font-semibold tracking-wider text-zinc-400 uppercase">
              System Overview
            </h2>
          </div>

          <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-black">
            <LayoutGrid className="mb-2 h-8 w-8 text-zinc-200 dark:text-zinc-800" />
            <p className="font-mono text-xs text-zinc-400 italic">
              Global activity monitoring active.
            </p>
          </div>
        </div>

        {/* Quick Setup/Links */}
        <div className="space-y-4 md:space-y-6 lg:col-span-3 lg:space-y-8">
          <h2 className="font-mono text-sm font-semibold tracking-wider text-zinc-400 uppercase">
            Administration
          </h2>
          <div className="grid gap-3">
            <AdminQuickLink
              title="Manage Users"
              desc="Roles, bans and permissions"
              url="/admin/users"
              icon={Users}
            />
            <AdminQuickLink
              title="Pages"
              desc="Custom pages and static content"
              url="/admin/pages"
              icon={FileText}
            />
            <AdminQuickLink
              title="SEO Management"
              desc="Metadata, sitemaps and tags"
              url="/admin/seo"
              icon={Search}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function AdminQuickLink({ title, desc, url, icon: Icon }) {
  return (
    <Link
      href={url}
      className="group flex cursor-pointer items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:hover:bg-zinc-900/50"
    >
      <div className="space-y-1">
        <p className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {Icon && (
            <Icon className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
          )}
          {title}
        </p>
        <p className="text-[11px] text-zinc-500">{desc}</p>
      </div>
      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 opacity-0 transition-opacity group-hover:opacity-100 dark:border-zinc-800">
        <ArrowRight className="h-3 w-3 text-zinc-500" />
      </div>
    </Link>
  );
}
