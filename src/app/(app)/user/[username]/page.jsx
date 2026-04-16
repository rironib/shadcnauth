import NotFoundState from "@/components/app/not-found-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";

import User from "@/models/User";
import { gravatar } from "next-gravatar";
import countries from "next-countries";
import { Calendar, ChevronRight, Globe, MapPin } from "lucide-react";
import { getServerSession } from "next-auth";

export async function generateMetadata({ params }) {
  const { username } = await params;

  await connectDB();

  let user = await User.findOne({
    $or: [
      { username: { $regex: new RegExp(`^${username}$`, "i") } },
      { previousUsernames: { $regex: new RegExp(`^${username}$`, "i") } },
    ],
  });

  if (!user) {
    return {
      title: "User Not Found",
    };
  }

  const title = `${user.name} (@${user.username})`;
  const description =
    user.bio ||
    `View the profile and discussions of ${user.name} on ${siteConfig.siteName}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteConfig.baseUrl}/user/${user.username}`,
      type: "profile",
    },
  };
}

export default async function PublicProfilePage({ params }) {
  const { username } = await params;
  const session = await getServerSession(authOptions);

  await connectDB();

  let user = await User.findOne({
    $or: [
      { username: { $regex: new RegExp(`^${username}$`, "i") } },
      { previousUsernames: { $regex: new RegExp(`^${username}$`, "i") } },
    ],
  }).lean();

  if (!user) {
    return (
      <NotFoundState
        title="User Not Found"
        detailedDescription="The user you are looking for does not exist or has been removed from our community."
        buttonText="Back to Home"
        showMetadata={false}
      />
    );
  }

  const avatar = gravatar(user.email || "info@shadcnauth.com", 200);
  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-4 text-left">
      {/* Profile Header */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-none">
        <div className="h-20 border-b bg-muted/30"></div>
        <div className="relative px-5 pb-5">
          <div className="-mt-8 flex flex-col items-center gap-4 pb-4 md:flex-row md:items-end">
            <Avatar className="h-20 w-20 rounded-full border-4 border-background shadow-none md:h-24 md:w-24">
              <AvatarImage src={avatar} />
              <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                {user.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 space-y-0.5 text-center md:text-left">
              <div className="flex min-w-0 flex-col gap-1.5 md:flex-row md:items-center">
                <h1 className="truncate text-xl font-bold tracking-tight md:text-2xl">
                  {user.name}
                </h1>
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                  className="mx-auto h-3.5 w-fit shrink-0 px-1 text-[8px] font-black tracking-widest uppercase md:mx-0"
                >
                  {user.role}
                </Badge>
              </div>
              <p className="text-xs font-semibold tracking-tight text-muted-foreground">
                @{user.username}
              </p>
              {user.bio && (
                <p className="mt-1.5 line-clamp-2 max-w-xl text-xs text-muted-foreground">
                  {user.bio}
                </p>
              )}
            </div>
          </div>

          <Separator className="opacity-50" />

          <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] font-bold tracking-tight text-muted-foreground/80 lowercase md:justify-start">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> joined {joinedDate}
            </div>
            {user.country && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />{" "}
                {countries.find(
                  (c) => c.code === user.country || c.name === user.country,
                )?.name || user.country}
              </div>
            )}
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-primary"
              >
                <Globe className="h-3.5 w-3.5" />{" "}
                {user.website.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Sidebar */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border bg-card shadow-none">
            <div className="border-b bg-muted/10 px-4 py-3">
              <h3 className="text-[10px] leading-none font-black tracking-widest text-muted-foreground/70 uppercase">
                Metrics
              </h3>
            </div>
          </div>

          {user.socialLinks &&
            Object.values(user.socialLinks).some((v) => v) && (
              <div className="rounded-xl border bg-card p-1 shadow-none">
                <div className="space-y-0.5 p-0">
                  {Object.entries(user.socialLinks).map(
                    ([platform, link]) =>
                      link && (
                        <Button
                          key={platform}
                          variant="ghost"
                          asChild
                          className="h-8 w-full justify-between px-3"
                        >
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="text-[10px] font-bold tracking-tight capitalize uppercase">
                              {platform}
                            </span>
                            <ChevronRight className="h-3 w-3 opacity-20" />
                          </a>
                        </Button>
                      ),
                  )}
                </div>
              </div>
            )}
        </div>

        {/* Recent Activity placeholder/info */}
        <div className="space-y-4 lg:col-span-2">
          <div className="overflow-hidden rounded-xl border bg-card shadow-none">
            <div className="border-b bg-muted/10 px-4 py-3">
              <h3 className="text-xs leading-none font-black tracking-widest uppercase">
                Profile Overview
              </h3>
            </div>
            <div className="p-8 text-center opacity-60">
              <p className="text-xs font-medium text-muted-foreground">
                This user has not shared any additional activity yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
