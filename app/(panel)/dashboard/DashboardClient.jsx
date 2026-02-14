"use client";

import { useUser } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardClient() {
  const { user, loading } = useUser();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-32">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        <p className="font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
          AUTHENTICATING SESSION...
        </p>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <main className="app-container">
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-zinc-100 pb-6 sm:flex-row sm:items-end dark:border-zinc-900">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
            Welcome back, {user.name ? user.name.split(" ")[0] : "User"}
          </h1>
          <p className="text-sm font-medium text-zinc-500">
            Overview of your community activity and engagement
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/30 py-24 text-center dark:border-zinc-800">
        <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
          Everything is looking good.
        </p>
      </div>
    </main>
  );
}
