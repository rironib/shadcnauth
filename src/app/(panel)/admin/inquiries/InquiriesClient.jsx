"use client";

import {
  getAdminInquiriesAction,
  updateInquiryAction,
} from "@/actions/admin/inquiry";
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
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Archive, CheckCircle2, ChevronLeft, ChevronRight, Clock, Mail } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function InquiriesClient() {
  const [data, setData] = useState({
    inquiries: [],
    stats: { total: 0, new: 0, read: 0, archived: 0 },
    pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
    loading: true,
  });

  const [filters, setFilters] = useState({
    status: "all",
    page: 1,
  });

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const fetchInquiries = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    try {
      const result = await getAdminInquiriesAction({
        page: filters.page,
        limit: 10,
        status: filters.status === "all" ? "" : filters.status,
      });

      if (result.success) {
        setData({
          inquiries: result.data.inquiries,
          stats: result.data.stats,
          pagination: result.data.pagination,
          loading: false,
        });
      } else {
        toast.error(result.error);
        setData((prev) => ({ ...prev, loading: false }));
      }
    } catch (error) {
      toast.error("Failed to load inquiries");
      setData((prev) => ({ ...prev, loading: false }));
    }
  }, [filters]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchInquiries();
  }, [fetchInquiries]);

  const handleUpdateInquiry = async (id, update) => {
    try {
      const result = await updateInquiryAction(id, update);
      if (result.success) {
        toast.success("Inquiry updated");
        fetchInquiries();
        if (selectedInquiry?._id === id) {
          setSelectedInquiry(result.data);
        }
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to update inquiry");
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Inquiries</h1>
        <p className="text-sm text-muted-foreground">Manage incoming user messages.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Received", value: data.stats.total, icon: Mail },
          { label: "New Messages", value: data.stats.new, icon: Clock },
          { label: "Already Viewed", value: data.stats.read, icon: CheckCircle2 },
          {
            label: "Archived / Resolved",
            value: data.stats.archived,
            icon: Archive,
          },
        ].map((stat, i) => (
          <div key={i} className="space-y-2 border-l-2 border-muted pl-4">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <stat.icon className="h-3 w-3" />
              {stat.label}
            </div>
            {data.loading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
            )}
          </div>
        ))}
      </div>

      {/* Main Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-lg font-semibold">Message History</h2>
          <Select
            value={filters.status}
            onValueChange={(val) =>
              setFilters({ ...filters, status: val, page: 1 })
            }
          >
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10">#</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : data.inquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-sm text-muted-foreground">
                    No inquiries found.
                  </TableCell>
                </TableRow>
              ) : (
                data.inquiries.map((inquiry, index) => (
                  <TableRow
                    key={inquiry._id}
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedInquiry(inquiry);
                      setIsSheetOpen(true);
                      if (inquiry.status === "new") {
                        handleUpdateInquiry(inquiry._id, { status: "read" });
                      }
                    }}
                  >
                    <TableCell className="text-muted-foreground transition-colors group-hover:text-foreground">
                      {(data.pagination.page - 1) * data.pagination.limit +
                        index +
                        1}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{inquiry.name}</div>
                        <div className="text-[10px] text-muted-foreground italic">
                          {inquiry.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm">
                      {inquiry.subject}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold px-1.5 py-0">
                        {inquiry.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs tabular-nums text-muted-foreground">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-xs text-muted-foreground">
            Displaying {data.pagination.page} / {data.pagination.totalPages} pages
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={data.pagination.page === 1}
              onClick={() =>
                setFilters({ ...filters, page: data.pagination.page - 1 })
              }
              className="h-8 gap-1 px-3"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={data.pagination.page === data.pagination.totalPages}
              onClick={() =>
                setFilters({ ...filters, page: data.pagination.page + 1 })
              }
              className="h-8 gap-1 px-3"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          {selectedInquiry && (
            <>
              <SheetHeader>
                <SheetTitle>Inquiry Details</SheetTitle>
                <SheetDescription>
                  Review the inquiry details. Update status to Archive when resolved.
                </SheetDescription>
              </SheetHeader>

              <div className="grid flex-1 auto-rows-min gap-6 px-4">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {selectedInquiry.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="inquiry-name">Sender Name</Label>
                  <Input id="inquiry-name" value={selectedInquiry.name} readOnly />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="inquiry-email">Email Address</Label>
                  <Input id="inquiry-email" value={selectedInquiry.email} readOnly />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="inquiry-subject">Subject</Label>
                  <Input id="inquiry-subject" value={selectedInquiry.subject} readOnly />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="inquiry-message">Message</Label>
                  <Textarea 
                    id="inquiry-message" 
                    value={selectedInquiry.message} 
                    readOnly 
                    className="min-h-[120px] resize-none"
                  />
                </div>
              </div>

              <SheetFooter>
                <Button
                   variant="destructive"
                   onClick={() => handleUpdateInquiry(selectedInquiry._id, { status: "archived" })}
                   disabled={selectedInquiry.status === "archived"}
                >
                  Archive
                </Button>
                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
