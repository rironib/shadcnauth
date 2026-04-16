"use client";

import { Info, ShieldCheck } from "lucide-react";

export default function ActivityClient() {
  return (
    <main className="app-container">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-zinc-100 pb-6 sm:flex-row sm:items-end dark:border-zinc-900">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
            Moderation Logs
          </h1>
          <p className="text-sm text-zinc-500">
            Audit trails of all moderation actions taken on the system.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-black">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-900/50">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            No Activity Logs Found
          </h3>
          <p className="mt-2 max-w-xs text-sm text-zinc-500">
            There are currently no moderation logs to display. All system audit
            trails will appear here.
          </p>
        </div>

        {/* Footer info/tip */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-100/50 bg-blue-50/50 p-4 dark:border-blue-900/20 dark:bg-blue-900/10">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
          <p className="text-xs leading-relaxed text-blue-700/80 dark:text-blue-300/80">
            <strong>System Audit Tip:</strong> Moderation logs are permanent and
            cannot be deleted. They provide a transparent history of all
            administrative actions for security and compliance.
          </p>
        </div>
      </div>
    </main>
  );
}
