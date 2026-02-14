"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import gravatarUrl from "gravatar-url";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * 👥 MemberRow: Displays a single member in a list format
 */
export function MemberRow({ member }) {
  const avatar = gravatarUrl(member.username + "@shadcnauth.com", {
    size: 100,
  });
  const initials = member.name?.charAt(0) || member.username?.charAt(0) || "?";

  return (
    <div className="group flex flex-col items-start justify-between gap-4 rounded-xl border border-muted/50 p-4 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Link href={`/user/${member.username}`} className="shrink-0">
          <Avatar className="h-12 w-12 border shadow-sm transition-transform group-hover:scale-105">
            <AvatarImage src={avatar} alt={member.name || member.username} />
            <AvatarFallback className="bg-primary/10 font-bold text-primary uppercase">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/user/${member.username}`}
              className="truncate text-base font-bold transition-colors hover:text-primary"
            >
              {member.name || member.username}
            </Link>
            <Badge
              variant="secondary"
              className="h-4 px-1.5 py-0 text-[10px] capitalize"
            >
              {member.role}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">@{member.username}</p>
          {member.bio && (
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground italic">
              {member.bio}
            </p>
          )}
        </div>
      </div>

      <div className="flex w-full shrink-0 items-center justify-between gap-6 sm:w-auto sm:justify-end sm:gap-8">
        <div className="flex min-w-[100px] flex-col items-end gap-1">
          <span className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
            <span
              className={cn(
                "size-1.5 rounded-full",
                member.lastActive &&
                  new Date() - new Date(member.lastActive) < 1000 * 60 * 15
                  ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                  : "bg-muted-foreground/30",
              )}
            />
            {member.lastActive
              ? formatDistanceToNow(new Date(member.lastActive), {
                  addSuffix: true,
                })
              : "N/A"}
          </span>
          <Link
            href={`/user/${member.username}`}
            className="text-[11px] font-bold text-primary hover:underline"
          >
            Profile →
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * 🛠️ MemberSort: Sorting control for the members list
 */
export function MemberSort({ currentSort = "newest" }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("page", "1");
    router.push(`/members?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-xs font-bold whitespace-nowrap text-muted-foreground uppercase sm:inline">
        Sort By:
      </span>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="h-9 w-[160px] border-muted-foreground/20 bg-background/50 text-xs font-medium">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Join Date</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * 📑 MemberTabs: Role-based filtering tabs
 */
export function MemberTabs({ currentRole = "all" }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRoleChange = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("role", value);
    params.set("page", "1");
    router.push(`/members?${params.toString()}`);
  };

  return (
    <Tabs
      value={currentRole}
      onValueChange={handleRoleChange}
      className="w-full"
    >
      <TabsList className="mb-6">
        <TabsTrigger value="all" className="tracking-wider uppercase">
          All Members
        </TabsTrigger>
        <TabsTrigger value="admin" className="tracking-wider uppercase">
          Admins
        </TabsTrigger>
        <TabsTrigger value="moderator" className="tracking-wider uppercase">
          Moderators
        </TabsTrigger>
        <TabsTrigger value="user" className="tracking-wider uppercase">
          Users
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
