"use client";

import { deleteSeoSettings } from "@/actions/admin/seo";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Eye, EyeOff, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SeoManagementClient({ initialData = [] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  // Filter data
  const filteredData = initialData.filter((item) =>
    search
      ? item.key.toLowerCase().includes(search.toLowerCase()) ||
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
      : true,
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const result = await deleteSeoSettings(deleteId);

      if (!result.success) throw new Error(result.error);

      toast.success("SEO entry deleted successfully");
      setDeleteId(null);
      router.refresh();
    } catch (error) {
      console.error("Error deleting SEO entry:", error);
      toast.error(error.message || "Failed to delete SEO entry");
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <main className="app-container">
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-zinc-100 pb-6 sm:flex-row sm:items-end dark:border-zinc-900">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
            SEO Management
          </h1>
          <p className="text-sm text-zinc-500">
            Global metadata, index control and crawler settings
          </p>
        </div>
        <Button asChild variant="default" size="sm">
          <Link href="/admin/seo/new">
            <Plus className="mr-2 h-3.5 w-3.5" /> New Entry
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2 py-1">
        <div className="relative max-w-sm flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <Search className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <input
            type="text"
            placeholder="Filter by key, title, or description..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-md border border-zinc-200 bg-white py-1.5 pr-3 pl-9 text-xs shadow-sm transition-all placeholder:text-zinc-500 focus:ring-1 focus:ring-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-black"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-black">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-zinc-100 bg-zinc-50/50 hover:bg-transparent dark:border-zinc-900 dark:bg-zinc-900/50">
              <TableHead className="h-10 w-[50px] px-6 font-mono text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                #
              </TableHead>
              <TableHead className="h-10 font-mono text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                Page Key
              </TableHead>
              <TableHead className="h-10 font-mono text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                Meta Details
              </TableHead>
              <TableHead className="h-10 text-center font-mono text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                Visibility
              </TableHead>
              <TableHead className="h-10 font-mono text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                Updated
              </TableHead>
              <TableHead className="h-10 text-right font-mono text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-48 text-center font-mono text-xs text-zinc-400 italic"
                >
                  NO SEO RECORDS FOUND.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((seo, index) => (
                <TableRow
                  key={seo._id}
                  className="group border-b border-zinc-100 transition-colors hover:bg-zinc-50/50 dark:border-zinc-900 dark:hover:bg-zinc-900/20"
                >
                  <TableCell className="px-6 py-4 font-mono text-[10px] text-zinc-400">
                    {(page - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[10px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                      {seo.key}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="space-y-0.5">
                      <p className="line-clamp-1 text-sm font-bold text-zinc-900 italic dark:text-zinc-100">
                        {seo.title}
                      </p>
                      <p className="line-clamp-1 max-w-sm text-[11px] text-zinc-500">
                        {seo.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <Badge
                      variant="outline"
                      className={`items-center gap-1 rounded-md py-0 font-mono text-[9px] font-bold tracking-tight uppercase ${seo.isActive ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100" : "border-zinc-200 text-zinc-400 dark:border-zinc-800"}`}
                    >
                      {seo.isActive ? (
                        <Eye className="h-2.5 w-2.5" />
                      ) : (
                        <EyeOff className="h-2.5 w-2.5" />
                      )}
                      {seo.isActive ? "Active" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="font-mono text-[10px] tracking-tighter text-zinc-400 uppercase">
                      {new Date(seo.updatedAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/seo/${seo._id}`}>
                          <Edit className="h-3.5 w-3.5 text-zinc-500" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(seo._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-900 dark:bg-zinc-900/50">
            <p className="font-mono text-[10px] tracking-tighter text-zinc-500 uppercase">
              Page {page} of {totalPages} • Total {filteredData.length} Records
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the SEO
              entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
