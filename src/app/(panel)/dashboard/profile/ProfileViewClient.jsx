"use client";

import { getUserProfileAction } from "@/actions/user/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { format } from "date-fns";
import {
  Calendar,
  Edit2,
  Github,
  Globe,
  Loader2,
  MapPin,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import countries from "next-countries";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfileViewClient() {
  const { user: sessionUser, loading: authLoading } = useUser();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await getUserProfileAction(sessionUser.id);
        if (result.success) {
          setUser(result.data);
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
  }, [sessionUser, authLoading]);

  if (authLoading || (loading && sessionUser)) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-32">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-xs text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!sessionUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Button onClick={() => router.push("/login")}>Sign In Required</Button>
      </div>
    );
  }

  if (!user && !loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>User profile not found.</p>
      </div>
    );
  }

  const profileData = user || sessionUser;

  return (
    <main className="app-container">
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-zinc-100 pb-6 sm:flex-row sm:items-end dark:border-zinc-900">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
            My Profile
          </h1>
          <p className="text-sm text-zinc-500">
            Your public facing profile information.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full font-bold sm:w-auto"
        >
          <Link href="/dashboard/profile/edit">
            <Edit2 className="mr-2 h-3.5 w-3.5" /> Edit Profile
          </Link>
        </Button>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Profile Header Section */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="h-24 bg-zinc-100 sm:h-32 dark:bg-zinc-900" />
          <div className="px-4 pb-6 sm:px-6 sm:pb-8">
            <div className="-mt-12 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:gap-6">
              <Avatar className="h-24 w-24 border-4 border-white shadow-md sm:h-32 sm:w-32 dark:border-zinc-950">
                <AvatarImage src={profileData.image} />
                <AvatarFallback className="bg-zinc-100 text-3xl sm:text-4xl dark:bg-zinc-900">
                  {profileData.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 pt-2 sm:pb-2">
                <h2 className="text-xl leading-tight font-bold text-zinc-900 sm:text-2xl dark:text-zinc-100">
                  {profileData.name}
                </h2>
                <p className="text-sm font-medium text-zinc-500 sm:text-base">
                  @{profileData.username || profileData.email?.split("@")[0]}
                </p>
              </div>
            </div>

            {/* Bio & Links Section (Integrated into header) */}
            <div className="mt-6 space-y-4 sm:space-y-6">
              {profileData.bio && (
                <p className="max-w-2xl text-sm leading-relaxed text-zinc-700 sm:text-base dark:text-zinc-300">
                  {profileData.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-xs text-zinc-500 sm:text-sm">
                {profileData.country && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {countries.find(
                      (c) =>
                        c.code === profileData.country ||
                        c.name === profileData.country,
                    )?.name || profileData.country}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Joined{" "}
                  {profileData.createdAt
                    ? format(new Date(profileData.createdAt), "MMMM yyyy")
                    : "Recently"}
                </div>
                {profileData.website && (
                  <a
                    href={profileData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-medium decoration-primary/20 transition-colors hover:text-primary hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    {profileData.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
                <div className="flex flex-wrap gap-3">
                  {profileData.socialLinks?.twitter && (
                    <a
                      href={`https://twitter.com/${profileData.socialLinks.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-medium transition-colors hover:text-primary"
                    >
                      <Twitter className="h-3.5 w-3.5" />@
                      {profileData.socialLinks.twitter.replace(/^@/, "")}
                    </a>
                  )}
                  {profileData.socialLinks?.github && (
                    <a
                      href={`https://github.com/${profileData.socialLinks.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-medium transition-colors hover:text-primary"
                    >
                      <Github className="h-3.5 w-3.5" />
                      {profileData.socialLinks.github}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid max-w-sm grid-cols-1 gap-3 sm:grid-cols-1 sm:gap-4 md:gap-6">
          {[].map((item) => (
            <div
              key={item.label}
              className="group space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md sm:p-6 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${item.bg} ${item.color}`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <p className="text-[10px] leading-none font-black tracking-widest text-zinc-500 uppercase sm:text-xs">
                  {item.label}
                </p>
              </div>
              <div className="space-y-1">
                <div className="text-2xl leading-tight font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
                  {item.value}
                </div>
                <p className="text-[10px] font-medium text-zinc-500 sm:text-xs">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
