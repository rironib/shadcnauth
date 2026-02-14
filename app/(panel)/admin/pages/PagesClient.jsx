"use client";

import { deletePageAction, getAdminPagesAction } from "@/actions/admin/page";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PagesClient() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    fetchPages(pageParam);
  }, [pageParam]);

  const fetchPages = async (page) => {
    setLoading(true);
    try {
      const result = await getAdminPagesAction(page, 10);
      if (result.success) {
        setPages(result.data);
        setPagination(result.pagination);
      } else {
        toast.error(result.error || "Failed to fetch pages");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await deletePageAction(id);
      if (result.success) {
        toast.success(result.message || "Page deleted successfully");
        fetchPages(pageParam);
      } else {
        toast.error(result.error || "Failed to delete page");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const handlePageChange = (newPage) => {
    router.push(`/admin/pages?page=${newPage}`);
  };

  return (
    <main className="app-container">
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-zinc-100 pb-6 sm:flex-row sm:items-end dark:border-zinc-900">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
            Pages
          </h1>
          <p className="text-sm text-zinc-500">
            Static content, legal documents and custom views
          </p>
        </div>
        <Button asChild variant="default" size="sm">
          <Link href="/admin/pages/new">
            <Plus className="mr-2 h-3.5 w-3.5" /> New Page
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-black">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-32">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            <p className="font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
              Loading pages...
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-zinc-100 bg-zinc-50/50 hover:bg-transparent dark:border-zinc-900 dark:bg-zinc-900/50">
                  <TableHead className="h-10 w-[50px] px-6 font-mono text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    #
                  </TableHead>
                  <TableHead className="h-10 font-mono text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Title
                  </TableHead>
                  <TableHead className="h-10 font-mono text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Path
                  </TableHead>
                  <TableHead className="h-10 text-center font-mono text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Status
                  </TableHead>
                  <TableHead className="h-10 font-mono text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Author
                  </TableHead>
                  <TableHead className="h-10 font-mono text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Updated
                  </TableHead>
                  <TableHead className="h-10 text-center font-mono text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-48 text-center font-mono text-xs text-zinc-400 italic"
                    >
                      NO PAGES FOUND.
                    </TableCell>
                  </TableRow>
                ) : (
                  pages.map((page, index) => (
                    <TableRow
                      key={page._id}
                      className="group border-b border-zinc-100 transition-colors hover:bg-zinc-50/50 dark:border-zinc-900 dark:hover:bg-zinc-900/20"
                    >
                      <TableCell className="px-6 py-4 font-mono text-[10px] text-zinc-400">
                        {(pagination.page - 1) * pagination.limit + index + 1}
                      </TableCell>
                      <TableCell className="py-4 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {page.title}
                      </TableCell>
                      <TableCell className="py-4 font-mono text-[10px] tracking-tighter text-zinc-500 uppercase">
                        /{page.slug}
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <Badge
                          variant="outline"
                          className={`rounded-md py-0 font-mono text-[9px] font-bold tracking-tight uppercase ${page.status === "published" ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100" : "border-zinc-200 text-zinc-400 dark:border-zinc-800"}`}
                        >
                          {page.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-xs text-zinc-500">
                        {page.authorId?.name || "Unknown"}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="font-mono text-[10px] tracking-tighter text-zinc-400 uppercase">
                          {new Date(page.updatedAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/page/${page.slug}`} target="_blank">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M15 3h6v6" />
                                <path d="M10 14 21 3" />
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              </svg>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/pages/update?id=${page._id}`}>
                              <Edit className="h-3.5 w-3.5 text-zinc-500" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-xl border-zinc-200 dark:border-zinc-800">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-lg font-bold tracking-tight">
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-sm text-zinc-500">
                                  This action cannot be undone. This will
                                  permanently delete the page &apos;
                                  {page.title}&apos; and remove its record from
                                  our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-md text-xs font-bold tracking-tight uppercase">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(page._id)}
                                >
                                  Delete Permanent
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {!loading && pagination.pages > 1 && (
              <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-900 dark:bg-zinc-900/50">
                <p className="font-mono text-[10px] tracking-tighter text-zinc-500 uppercase">
                  Page {pagination.page} of {pagination.pages}
                </p>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page <= 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
