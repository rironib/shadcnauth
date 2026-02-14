"use client";

import { getModeratorStatsDetailAction } from "@/actions/moderator/stats";
import { AlertTriangle, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ModeratorDashboardClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getModeratorStatsDetailAction();
        if (result.success) {
          setData(result.data);
        } else {
          console.error("Moderator stats error:", result.error);
          setError(result.error);
        }
      } catch (err) {
        console.error("Moderator stats exception:", err);
        setError(
          `An error occurred while fetching data: ${err.message || err}`,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-300" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-8 rounded-lg bg-red-50 p-8 text-center dark:bg-red-900/10">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/20">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-200">
          Access Denied or API Error
        </h3>
        <p className="mt-2 text-red-700 dark:text-red-300">{error}</p>
        <button
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <main className="app-container">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-zinc-100 pb-6 sm:flex-row sm:items-end dark:border-zinc-900">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
            Moderator Dashboard
          </h1>
          <p className="text-sm text-zinc-500">
            System-wide moderation logs and priority tasks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/30 py-24 text-center dark:border-zinc-800">
            <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
              No pending tasks at the moment.
            </p>
          </div>
        </div>

        {/* Sidebar: Navigation/Actions */}
        <div className="space-y-6 lg:col-span-3">
          <h2 className="text-lg font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
            Quick Actions
          </h2>
          <div className="grid w-full gap-3">
            <Link
              href="/moderator/activity"
              className="group flex cursor-pointer items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-black dark:hover:border-zinc-700"
            >
              <div className="space-y-1">
                <p className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  <ShieldCheck className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-blue-500" />
                  Security Logs
                </p>
                <p className="text-[11px] text-zinc-500">View audit trails</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
