"use client";

import {
  getUserProfileAction,
  updateUserProfileAction,
} from "@/actions/user/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { gravatar } from "next-gravatar";
import countries from "next-countries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  bio: z.string().max(160, "Bio must be at most 160 characters").optional(),
  country: z.string().max(50).optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter: z.string().max(50).optional(),
  github: z.string().max(50).optional(),
});

export default function EditProfileClient() {
  const { user: sessionUser, loading: authLoading } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      bio: "",
      country: "",
      website: "",
      twitter: "",
      github: "",
    },
  });

  const bioValue = watch("bio") || "";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await getUserProfileAction(sessionUser.id);
        if (result.success) {
          const data = result.data;
          setProfile(data);
          reset({
            name: data.name || "",
            bio: data.bio || "",
            country: data.country || "",
            website: data.website || "",
            twitter: data.socialLinks?.twitter || "",
            github: data.socialLinks?.github || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionUser?.id) {
      fetchProfile();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [sessionUser, authLoading, reset]);

  const onSubmit = async (data) => {
    if (!sessionUser?.id) {
      toast.error("User not found");
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        name: data.name,
        bio: data.bio,
        country: data.country,
        website: data.website,
        socialLinks: {
          twitter: data.twitter,
          github: data.github,
        },
      };

      const result = await updateUserProfileAction(sessionUser.id, updateData);

      if (!result.success) {
        throw new Error(result.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully");
      router.refresh();
      router.push("/dashboard/profile");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || (loading && sessionUser)) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-32">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-xs text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!sessionUser) {
    router.push("/login");
    return null;
  }

  const profileData = profile || sessionUser;

  return (
    <main className="app-container">
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-zinc-100 pb-6 sm:flex-row sm:items-end dark:border-zinc-900">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
            Edit Profile
          </h1>
          <p className="text-sm text-zinc-500">
            Manage your public presence and personal information.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
            <CardDescription>
              Managed via Gravatar based on your email address (
              {profileData?.email}).
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={gravatar(profileData?.email, 160)} />
              <AvatarFallback className="text-xl">
                {profileData?.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" asChild>
              <a href="https://gravatar.com" target="_blank" rel="noopener">
                Change on Gravatar
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update your display name and location.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null">Select a country</SelectItem>
                        {countries.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.country && (
                  <p className="text-xs text-destructive">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register("bio")}
                placeholder="Tell us about yourself..."
                rows={4}
              />
              <div className="mt-1 flex items-center justify-between">
                {errors.bio ? (
                  <p className="text-xs text-destructive">
                    {errors.bio.message}
                  </p>
                ) : (
                  <div />
                )}
                <p className="text-xs text-muted-foreground">
                  {bioValue.length}/160 characters
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>
              Connect your social media accounts.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                {...register("website")}
                placeholder="https://..."
              />
              {errors.website && (
                <p className="text-xs text-destructive">
                  {errors.website.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter / X</Label>
              <Input
                id="twitter"
                {...register("twitter")}
                placeholder="@username"
              />
              {errors.twitter && (
                <p className="text-xs text-destructive">
                  {errors.twitter.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                {...register("github")}
                placeholder="username"
              />
              {errors.github && (
                <p className="text-xs text-destructive">
                  {errors.github.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saving ? "Saving Changes..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
      </form>
    </main>
  );
}
