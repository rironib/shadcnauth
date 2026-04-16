"use client";

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
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useState } from "react";

export function LogoutAlert({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  children,
  buttonText = "Logout",
  buttonSize = "sm",
  buttonVariant = "outline",
  callbackUrl = "/login",
  variant = "default",
}) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Determine if component is controlled or uncontrolled
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalOpen;

  const handleLogout = () => {
    signOut({ callbackUrl });
  };

  const contentClassName =
    variant === "glassmorphism" ? "glassmorphism border-primary/20" : "";

  const titleClassName = variant === "glassmorphism" ? "text-2xl" : "text-xl";

  const descriptionClassName =
    variant === "glassmorphism" ? "text-base text-gray-400" : "";

  const footerClassName = variant === "glassmorphism" ? "mt-4" : "";

  const cancelClassName =
    variant === "glassmorphism" ? "rounded-full cursor-pointer" : "";

  const actionClassName =
    variant === "glassmorphism"
      ? "bg-destructive cursor-pointer hover:bg-destructive/90 rounded-full px-8"
      : "bg-destructive hover:bg-destructive/90";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {!isControlled && (
        <AlertDialogTrigger asChild>
          {children || (
            <Button size={buttonSize} variant={buttonVariant}>
              {buttonText}
            </Button>
          )}
        </AlertDialogTrigger>
      )}
      <AlertDialogContent className={contentClassName}>
        <AlertDialogHeader>
          <AlertDialogTitle className={titleClassName}>
            Are you sure you want to logout?
          </AlertDialogTitle>
          <AlertDialogDescription className={descriptionClassName}>
            You will be signed out of your session. You can always sign back in
            later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={footerClassName}>
          <AlertDialogCancel className={cancelClassName}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout} className={actionClassName}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
