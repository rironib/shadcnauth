"use client";

import { NavMain } from "@/components/panel/nav-main";
import { NavSecondary } from "@/components/panel/nav-secondary";
import { NavUser } from "@/components/panel/nav-user";
import { PanelSwitcher } from "@/components/panel/panel-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { data } from "@/config/sidebar-config";
import { useUser } from "@/hooks/use-user";
import { usePathname } from "next/navigation";
import * as React from "react";

export function AppSidebar({ ...props }) {
  const pathname = usePathname();
  const { user, loading } = useUser();
  const role = user?.role || "user";

  // Filter panels based on user role
  const filteredPanels = React.useMemo(() => {
    if (role === "admin") return data.panels;
    if (role === "moderator") {
      return data.panels.filter((p) => p.name !== "Administrator");
    }
    return data.panels.filter((p) => p.name === "Dashboard");
  }, [role]);

  // Determine which menu to show based on URL & Role
  const menuItems = React.useMemo(() => {
    if (pathname.startsWith("/admin") && role === "admin") {
      return data.navMain.admin;
    }
    if (
      pathname.startsWith("/moderator") &&
      (role === "admin" || role === "moderator")
    ) {
      return data.navMain.moderator;
    }
    return data.navMain.user;
  }, [pathname, role]);

  if (loading) return null;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <PanelSwitcher panels={filteredPanels} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuItems} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
