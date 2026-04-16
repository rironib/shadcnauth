"use client";

import {
  deleteMemberAction,
  getAdminMembersAction,
  updateMemberAction,
} from "@/actions/admin/member";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  Ban,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Shield,
  Trash2,
  UserCheck,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { gravatar } from "next-gravatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MembersClient() {
  const [data, setData] = useState({
    members: [],
    stats: { totalMembers: 0, activeToday: 0, banned: 0, newThisWeek: 0 },
    pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
    loading: true,
  });

  const [filters, setFilters] = useState({
    role: "all",
    status: "all",
    page: 1,
  });

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
    confirmText: "Confirm",
    variant: "default",
  });

  const fetchMembers = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    try {
      const result = await getAdminMembersAction({
        page: filters.page,
        limit: 10,
        role: filters.role === "all" ? "" : filters.role,
        status: filters.status === "all" ? "" : filters.status,
      });

      if (result.success) {
        setData({
          members: result.data.members,
          stats: result.data.stats,
          pagination: result.data.pagination,
          loading: false,
        });
      } else {
        toast.error(result.error);
        setData((prev) => ({ ...prev, loading: false }));
      }
    } catch (error) {
      toast.error("Failed to load members");
      setData((prev) => ({ ...prev, loading: false }));
    }
  }, [filters]);

  useEffect(() => {
    // Small delay to avoid cascading render warning on initial load
    const timeout = setTimeout(() => {
      fetchMembers();
    }, 0);
    return () => clearTimeout(timeout);
  }, [fetchMembers]);

  const handleUpdateUser = async (userId, update) => {
    try {
      const result = await updateMemberAction(userId, update);
      if (result.success) {
        toast.success("Member updated successfully");
        fetchMembers();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to update member");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const result = await deleteMemberAction(userId);
      if (result.success) {
        toast.success("Member deleted successfully");
        fetchMembers();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to delete member");
    }
  };

  const openConfirm = (config) => {
    setConfirmDialog({
      isOpen: true,
      title: config.title || "Are you sure?",
      description: config.description || "This action cannot be undone.",
      confirmText: config.confirmText || "Confirm",
      variant: config.variant || "default",
      onConfirm: async () => {
        await config.action();
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "banned":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "suspended":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "moderator":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  return (
    <main className="app-container">
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-zinc-100 pb-6 sm:flex-row sm:items-end dark:border-zinc-900">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
            Manage Users
          </h1>
          <p className="text-sm text-zinc-500">
            Monitor user activity, roles, and community safety.
          </p>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2 md:gap-4 lg:grid-cols-4 lg:gap-6">
        {[
          {
            label: "Total Members",
            value: data.stats.totalMembers,
            icon: UserIcon,
          },
          {
            label: "Active Today",
            value: data.stats.activeToday,
            icon: UserCheck,
          },
          { label: "Banned", value: data.stats.banned, icon: Ban },
          {
            label: "New This Week",
            value: data.stats.newThisWeek,
            icon: Shield,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-[10px] leading-none tracking-widest text-zinc-400 uppercase">
                {stat.label}
              </h3>
              <stat.icon className="h-4 w-4 text-zinc-300 dark:text-zinc-700" />
            </div>
            <p className="text-3xl leading-tight font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters & Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="gap-4 space-y-4 border-b border-zinc-100 p-4 md:flex md:items-center md:justify-end md:space-y-0 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <Select
              value={filters.role}
              onValueChange={(val) =>
                setFilters({ ...filters, role: val, page: 1 })
              }
            >
              <SelectTrigger className="h-10 w-[140px] rounded-xl">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(val) =>
                setFilters({ ...filters, status: val, page: 1 })
              }
            >
              <SelectTrigger className="h-10 w-[140px] rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50/50 hover:bg-zinc-50/50 dark:bg-zinc-800/20 dark:hover:bg-zinc-800/20">
                <TableHead className="h-10 w-12 text-center font-mono text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  #
                </TableHead>
                <TableHead className="h-10 font-mono text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Member
                </TableHead>
                <TableHead className="h-10 text-center font-mono text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Role
                </TableHead>
                <TableHead className="h-10 text-center font-mono text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Status
                </TableHead>
                <TableHead className="h-10 text-center font-mono text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Joined
                </TableHead>
                <TableHead className="h-10 text-center font-mono text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Last Active
                </TableHead>
                <TableHead className="h-10 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell
                      colSpan={7}
                      className="h-16 animate-pulse bg-zinc-50/50 dark:bg-zinc-800/10"
                    />
                  </TableRow>
                ))
              ) : data.members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <p className="font-mono text-sm text-zinc-400 italic">
                      No members found matching your criteria.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                data.members.map((member, index) => (
                  <TableRow
                    key={member._id}
                    className="group transition-colors hover:bg-zinc-50/30 dark:hover:bg-zinc-800/10"
                  >
                    <TableCell className="py-4 text-center font-mono text-xs text-zinc-400">
                      {(data.pagination.page - 1) * data.pagination.limit +
                        index +
                        1}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-zinc-900">
                          <AvatarImage
                            src={gravatar(member.email, 100)}
                            alt={member.name}
                          />
                          <AvatarFallback className="bg-primary/5 text-xs font-bold text-primary">
                            {(member.name || member.username || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                          <Link
                            href={`/user/${member.username}`}
                            className="text-sm font-bold text-zinc-900 transition-colors hover:text-primary dark:text-zinc-100"
                          >
                            {member.name || member.username}
                          </Link>
                          <p className="font-mono text-[11px] leading-none text-zinc-500">
                            @{member.username}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-widest uppercase",
                          getRoleColor(member.role),
                        )}
                      >
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-widest uppercase",
                          getStatusColor(member.status),
                        )}
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-center font-mono text-xs text-zinc-500">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-4 text-center font-mono text-xs text-zinc-500">
                      {member.lastActive
                        ? new Date(member.lastActive).toLocaleDateString()
                        : "Never"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 rounded-xl border-zinc-100 p-1 shadow-xl dark:border-zinc-800"
                        >
                          <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black tracking-widest text-zinc-400 uppercase">
                            Quick Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/user/${member.username}`}
                              className="cursor-pointer gap-2 py-2"
                            >
                              <UserIcon className="h-3.5 w-3.5" /> View Profile
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black tracking-widest text-zinc-400 uppercase">
                            Change Role
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              openConfirm({
                                title: "Promote to Admin?",
                                description: `Are you sure you want to make ${member.name || member.username} an administrator?`,
                                confirmText: "Yes, Promote",
                                action: () =>
                                  handleUpdateUser(member._id, {
                                    role: "admin",
                                  }),
                              })
                            }
                            className="cursor-pointer gap-2 py-2"
                          >
                            <Shield className="h-3.5 w-3.5 text-purple-500" />{" "}
                            Make Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              openConfirm({
                                title: "Make Moderator?",
                                description: `Assign moderator privileges to ${member.name || member.username}?`,
                                confirmText: "Yes, Assign",
                                action: () =>
                                  handleUpdateUser(member._id, {
                                    role: "moderator",
                                  }),
                              })
                            }
                            className="cursor-pointer gap-2 py-2"
                          >
                            <Shield className="h-3.5 w-3.5 text-blue-500" />{" "}
                            Make Moderator
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              openConfirm({
                                title: "Demote to User?",
                                description: `Remove all special privileges from ${member.name || member.username}?`,
                                confirmText: "Yes, Demote",
                                action: () =>
                                  handleUpdateUser(member._id, {
                                    role: "user",
                                  }),
                              })
                            }
                            className="cursor-pointer gap-2 py-2"
                          >
                            <UserIcon className="h-3.5 w-3.5 text-zinc-500" />{" "}
                            Make User
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black tracking-widest text-zinc-400 uppercase">
                            Safety
                          </DropdownMenuLabel>
                          {member.status === "active" ? (
                            <DropdownMenuItem
                              onClick={() =>
                                openConfirm({
                                  title: "Ban Member?",
                                  description: `Are you sure you want to ban ${member.name || member.username}? They will no longer be able to access their account or log in.`,
                                  confirmText: "Ban Member",
                                  variant: "destructive",
                                  action: () =>
                                    handleUpdateUser(member._id, {
                                      status: "banned",
                                    }),
                                })
                              }
                              className="cursor-pointer gap-2 py-2 text-red-500 focus:text-red-500"
                            >
                              <Ban className="h-3.5 w-3.5" /> Ban Member
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() =>
                                openConfirm({
                                  title: "Unban Member?",
                                  description: `Restore access for ${member.name || member.username}?`,
                                  confirmText: "Unban Member",
                                  action: () =>
                                    handleUpdateUser(member._id, {
                                      status: "active",
                                    }),
                                })
                              }
                              className="cursor-pointer gap-2 py-2 text-green-500 focus:text-green-500"
                            >
                              <UserCheck className="h-3.5 w-3.5" /> Unban Member
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() =>
                              openConfirm({
                                title: "Delete Member Account?",
                                description: `This will permanently delete ${member.name || member.username}'s account and all associated data. This action is irreversible.`,
                                confirmText: "Delete Permanently",
                                variant: "destructive",
                                action: () => handleDeleteUser(member._id),
                              })
                            }
                            className="cursor-pointer gap-2 py-2 font-bold text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-zinc-100 p-4 dark:border-zinc-800">
          <p className="font-mono text-xs text-zinc-500">
            Showing{" "}
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {(data.pagination.page - 1) * data.pagination.limit + 1}
            </span>{" "}
            -{" "}
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {Math.min(
                data.pagination.page * data.pagination.limit,
                data.pagination.total,
              )}
            </span>{" "}
            of{" "}
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {data.pagination.total}
            </span>{" "}
            members
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={data.pagination.page === 1 || data.loading}
              onClick={() =>
                setFilters({ ...filters, page: data.pagination.page - 1 })
              }
              className="h-8 w-8 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={
                data.pagination.page === data.pagination.totalPages ||
                data.loading
              }
              onClick={() =>
                setFilters({ ...filters, page: data.pagination.page + 1 })
              }
              className="h-8 w-8 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) =>
          setConfirmDialog((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDialog.onConfirm}
              variant={
                confirmDialog.variant === "destructive"
                  ? "destructive"
                  : "default"
              }
            >
              {confirmDialog.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
