import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Home,
  LayoutDashboard,
  LifeBuoy,
  Send,
  Settings,
  Shield,
  User,
} from "lucide-react";

export const data = {
  panels: [
    {
      name: "Dashboard",
      logo: GalleryVerticalEnd,
      link: "/dashboard",
    },
    {
      name: "Moderator",
      logo: AudioWaveform,
      link: "/moderator",
    },
    {
      name: "Administrator",
      logo: Command,
      link: "/admin",
    },
  ],
  navMain: {
    user: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: true,
        items: [
          {
            title: "Dashboard",
            url: "/dashboard",
          },
        ],
      },
      {
        title: "Account",
        url: "/dashboard/profile",
        icon: User,
        isActive: true,
        items: [
          {
            title: "View Profile",
            url: "/dashboard/profile",
          },
          {
            title: "Edit Profile",
            url: "/dashboard/profile/edit",
          },
          {
            title: "Settings",
            url: "/dashboard/settings",
          },
        ],
      },
    ],
    moderator: [
      {
        title: "Dashboard",
        url: "/moderator",
        icon: LayoutDashboard,
        isActive: true,
        items: [
          {
            title: "Overview",
            url: "/moderator",
          },
        ],
      },
      {
        title: "Moderation",
        url: "/moderator",
        icon: Shield,
        isActive: true,
        items: [{ title: "Moderation Logs", url: "/moderator/activity" }],
      },
    ],
    admin: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
        isActive: true,
        items: [
          {
            title: "Overview",
            url: "/admin",
          },
        ],
      },
      {
        title: "Administration",
        url: "/admin",
        icon: Settings,
        isActive: true,
        items: [
          { title: "Analytics", url: "/admin/analytics" },
          { title: "Users", url: "/admin/users" },
          { title: "Pages", url: "/admin/pages" },
          { title: "SEO Management", url: "/admin/seo" },
          { title: "System Settings", url: "/admin/settings" },
        ],
      },
    ],
  },

  navSecondary: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Support",
      url: "/page/contact",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};
