"use client";

import { LogoutButton } from "@/components/app/logout-button";
import { MobileNavUser } from "@/components/app/mobile-nav-user";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { atomic_age } from "@/config/fonts";
import { cn } from "@/lib/utils";
import { gravatar } from "next-gravatar";
import { HelpCircle, LayoutDashboard, Menu, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const ListItem = React.forwardRef(
  ({ className, title, children, icon: Icon, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            className={cn(
              "block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="flex items-center gap-2 text-sm leading-none font-medium">
              {Icon && (
                <Icon className="size-4 text-primary" aria-hidden="true" />
              )}
              {title}
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = "ListItem";

const navLinks = [
  { title: "Members", href: "/members", icon: Users },
  { title: "Help & Support", href: "/page/contact", icon: HelpCircle },
];

export const Header = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);
  const avatar = session?.user?.email ? gravatar(session.user.email, 50) : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-2 sm:px-3 md:px-4 lg:px-6 xl:px-0">
        {/* Left Side: Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2">
            <span
              className={cn(
                atomic_age.className,
                "text-xl font-black tracking-tight sm:inline-block md:text-2xl",
              )}
            >
              ShadcnUI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center lg:flex">
            <NavigationMenu>
              <NavigationMenuList>
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "bg-transparent font-semibold",
                        )}
                      >
                        {link.title}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}

                {session && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/dashboard"
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "bg-transparent font-semibold",
                        )}
                      >
                        Dashboard
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* Right Side: Tools & User */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeSwitcher />

          <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard/profile">
                <Avatar className="h-7 w-7 border transition-opacity hover:opacity-80">
                  <AvatarImage src={avatar} alt={session.user.name} />
                  <AvatarFallback className="bg-primary/10 font-bold text-primary uppercase">
                    {session.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="hidden md:block">
                <LogoutButton />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden rounded-full sm:inline-flex"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full px-5">
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full lg:hidden"
              >
                <Menu className="size-6" aria-hidden="true" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] pr-0 sm:w-[350px]">
              <SheetHeader className="px-7">
                <SheetTitle className="text-left">
                  <Link href="/" onClick={() => setIsOpen(false)}>
                    <span
                      className={cn(atomic_age.className, "text-xl font-bold")}
                    >
                      ShadcnUI
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-6 pt-0 pr-7">
                <div className="space-y-1">
                  <h4 className="mb-2 px-3 text-xs font-bold text-muted-foreground uppercase">
                    Navigation
                  </h4>
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent",
                      pathname === "/"
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    <LayoutDashboard className="size-4" />
                    Home
                  </Link>
                  {session && (
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent",
                        pathname === "/dashboard"
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </Link>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="mb-2 px-3 text-xs font-bold text-muted-foreground uppercase">
                    Explore
                  </h4>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
                    >
                      <link.icon className="size-4" />
                      {link.title}
                    </Link>
                  ))}
                </div>

                <div className="mt-auto pt-6">
                  {!session ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                      >
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          Login
                        </Link>
                      </Button>
                      <Button asChild size="sm" className="rounded-full">
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          Join
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <MobileNavUser />
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
