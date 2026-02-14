import { getMembers } from "@/actions/public/members";
import { MemberRow, MemberSort, MemberTabs } from "@/components/app/members";
import { Button } from "@/components/ui/button";
import { Target, Users } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Members | ShadcnUI Auth",
  description:
    "Meet our top contributors and community members. Connect with fellow tech enthusiasts.",
};

async function MembersList({ page, sort, role }) {
  const result = await getMembers(page, 20, sort, role);

  if (!result.success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-4">
          <Target className="size-8 text-destructive" />
        </div>
        <h3 className="text-xl font-bold">Failed to load members</h3>
        <p className="text-muted-foreground">Please try again later.</p>
      </div>
    );
  }

  if (result.members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Users className="size-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold">No members found</h3>
        <p className="text-muted-foreground">
          No members match the selected filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3">
        {result.members.map((member) => (
          <MemberRow key={member._id} member={member} />
        ))}
      </div>

      {result.pagination.pages > 1 && (
        <div className="flex justify-center gap-2 pt-8">
          {Array.from({ length: result.pagination.pages }, (_, i) => i + 1).map(
            (p) => (
              <Button
                key={p}
                variant={
                  p === result.pagination.currentPage ? "default" : "outline"
                }
                size="sm"
                asChild
              >
                <Link
                  href={`/members?page=${p}${sort ? `&sort=${sort}` : ""}${role ? `&role=${role}` : ""}`}
                >
                  {p}
                </Link>
              </Button>
            ),
          )}
        </div>
      )}
    </div>
  );
}

export default async function MembersPage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params.page) || 1;
  const sort = params.sort || "newest";
  const role = params.role || "all";

  return (
    <div className="container mx-auto">
      {/* Header Section */}
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold tracking-wider text-primary uppercase">
            <Users className="size-4" />
            <span>Community</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight lg:text-4xl">
            Members Directory
          </h1>
          <p className="max-w-2xl text-sm tracking-tight text-muted-foreground lg:text-base">
            Connect with thousands of developers, designers, and tech
            enthusiasts from around the world.
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <MemberTabs currentRole={role} />

      {/* Filters Section */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 border-b border-muted/50 pb-6 sm:flex-row">
        <div className="w-full sm:w-auto">
          {/* Search removed as per requirements */}
        </div>
        <MemberSort currentSort={sort} />
      </div>

      {/* List Section */}
      <Suspense
        fallback={
          <div className="flex flex-col gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-20 w-full animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
        }
      >
        <MembersList page={page} sort={sort} role={role} />
      </Suspense>
    </div>
  );
}
