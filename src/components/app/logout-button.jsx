"use client";

import { LogoutAlert } from "@/components/app/logout-alert";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function LogoutButton() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setShowLogoutDialog(true)}
      >
        Logout
      </Button>
      <LogoutAlert
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        callbackUrl="/login"
        variant="default"
      />
    </>
  );
}
