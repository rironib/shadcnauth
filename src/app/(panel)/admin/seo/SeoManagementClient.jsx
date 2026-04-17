"use client";

import { deleteSeoSettings, saveSeoSettings, updateSeoSettings } from "@/actions/admin/seo";
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
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Edit,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SeoManagementClient({ initialData = [] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  // Sheet state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSeo, setSelectedSeo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter data
  const filteredData = initialData.filter((item) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      item.key?.toLowerCase().includes(s) ||
      item.title?.toLowerCase().includes(s) ||
      item.description?.toLowerCase().includes(s)
    );
  });

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

  const handleOpenCreate = () => {
    setSelectedSeo(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (seo) => {
    setSelectedSeo(seo);
    setIsOpen(true);
  };

  return (
    <main className="app-container">
      <div className="flex flex-col justify-between gap-4 pb-4 border-b mb-0 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            SEO Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Global metadata, index control and crawler settings
          </p>
        </div>
        <Button onClick={handleOpenCreate} variant="default">
          <Plus className="mr-2 h-4 w-4" /> New Entry
        </Button>
      </div>

        <div className="relative max-w-sm mb-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search keywords..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-9 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

      <div className="w-full rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">#</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Meta Details</TableHead>
              <TableHead className="text-center">Visibility</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-96 p-0">
                  <Empty>
                    <EmptyMedia variant="icon">
                      <Search className="size-4" />
                    </EmptyMedia>
                    <EmptyHeader>
                      <EmptyTitle>No SEO records found</EmptyTitle>
                      <EmptyDescription>
                        You haven't created any SEO configurations yet. Click the
                        button above to get started.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((seo, index) => (
                <TableRow key={seo._id}>
                  <TableCell className="font-medium text-muted-foreground">
                    {(page - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell>
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-semibold">
                      {seo.key}
                    </code>
                  </TableCell>
                  <TableCell className="max-w-[300px] whitespace-normal">
                    <div className="space-y-1">
                      <span className="font-medium">{seo.title}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {seo.description}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={seo.isActive ? "default" : "secondary"}
                      className="text-[10px] uppercase font-bold px-2 py-0"
                    >
                      {seo.isActive ? "Active" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {seo.updatedAt || seo.createdAt
                      ? new Date(seo.updatedAt || seo.createdAt).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 whitespace-nowrap">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEdit(seo)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(seo._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t p-4">
            <p className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
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

      <SeoSheet
        open={isOpen}
        onOpenChange={setIsOpen}
        initialData={selectedSeo}
        onSuccess={() => {
          setIsOpen(false);
          router.refresh();
        }}
      />

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

function SeoSheet({ open, onOpenChange, initialData, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    key: "",
    title: "",
    description: "",
    keywords: "",
    cover: "",
    link: "",
    robots: "index, follow",
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setFormData({
        key: initialData?.key || "",
        title: initialData?.title || "",
        description: initialData?.description || "",
        keywords: initialData?.keywords || "",
        cover: initialData?.cover || "",
        link: initialData?.link || "",
        robots: initialData?.robots || "index, follow",
        isActive: initialData?.isActive ?? true,
      });
      setErrors({});
    }
  }, [open, initialData]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.key) newErrors.key = { message: "Key is required" };
    if (!formData.title) newErrors.title = { message: "Title is required" };
    if (!formData.description) newErrors.description = { message: "Description is required" };
    else if (formData.description.length > 160) newErrors.description = { message: "Max 160 characters" };

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      let result;
      if (isEdit) {
        result = await updateSeoSettings(initialData._id, formData);
      } else {
        result = await saveSeoSettings(formData);
      }

      if (!result.success) {
        throw new Error(result.error || "Failed to save SEO entry");
      }

      toast.success(`SEO entry ${isEdit ? "updated" : "created"} successfully`);
      onSuccess();
    } catch (error) {
      console.error("Error saving SEO entry:", error);
      toast.error(error.message || "Failed to save SEO entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit SEO" : "New SEO"}</SheetTitle>
          <SheetDescription>
            {isEdit ? "Update existing SEO data." : "Add new SEO metadata."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={onSubmit} className="overflow-y-auto">
          <div className="grid flex-1 auto-rows-min gap-3 px-4">
            <Field>
              <FieldLabel>Key</FieldLabel>
              <FieldContent>
                <Input
                  value={formData.key}
                  onChange={(e) => handleChange("key", e.target.value)}
                  placeholder="e.g. home_page"
                  disabled={isEdit}
                />
                <FieldDescription>
                  The unique identifier for this SEO record.
                </FieldDescription>
                <FieldError errors={[errors.key]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Title</FieldLabel>
              <FieldContent>
                <Input
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter page title"
                />
                <FieldError errors={[errors.title]} />
              </FieldContent>
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>Description</FieldLabel>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {formData.description.length}/160
                </span>
              </div>
              <FieldContent>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Brief description..."
                  className="min-h-[100px]"
                />
                <FieldError errors={[errors.description]} />
              </FieldContent>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Robots</FieldLabel>
                <FieldContent>
                  <Select
                    onValueChange={(value) => handleChange("robots", value)}
                    value={formData.robots}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select robots" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="index, follow">index, follow</SelectItem>
                      <SelectItem value="noindex, follow">noindex, follow</SelectItem>
                      <SelectItem value="index, nofollow">index, nofollow</SelectItem>
                      <SelectItem value="noindex, nofollow">noindex, nofollow</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError errors={[errors.robots]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Status</FieldLabel>
                <FieldContent>
                  <div className="flex h-8 items-center gap-2 rounded-md border p-2">
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleChange("isActive", checked)}
                      size="sm"
                    />
                    <span className="text-xs">Active</span>
                  </div>
                </FieldContent>
              </Field>
            </div>

            <Field>
              <FieldLabel>Canonical URL</FieldLabel>
              <FieldContent>
                <Input
                  value={formData.link}
                  onChange={(e) => handleChange("link", e.target.value)}
                  placeholder="https://..."
                />
                <FieldError errors={[errors.link]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Image Link</FieldLabel>
              <FieldContent>
                <Input
                  value={formData.cover}
                  onChange={(e) => handleChange("cover", e.target.value)}
                  placeholder="https://..."
                />
                <FieldError errors={[errors.cover]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Keywords</FieldLabel>
              <FieldContent>
                <Input
                  value={formData.keywords}
                  onChange={(e) => handleChange("keywords", e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                />
                <FieldDescription>Separate with commas.</FieldDescription>
                <FieldError errors={[errors.keywords]} />
              </FieldContent>
            </Field>
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                isEdit ? "Save Changes" : "Create SEO"
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
