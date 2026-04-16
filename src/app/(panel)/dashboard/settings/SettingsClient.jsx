"use client";

import { updateUserProfileAction } from "@/actions/user/profile";
import { changePassword, deleteAccount } from "@/actions/user/settings";
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
import { useUser } from "@/hooks/use-user";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsClient() {
  const { user, update } = useUser();
  const [loading, setLoading] = useState({
    username: false,
    password: false,
    delete: false,
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");

  // Password Visibility States
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    if (!newUsername || newUsername === user?.username) return;

    setLoading((prev) => ({ ...prev, username: true }));
    try {
      const result = await updateUserProfileAction(user.id, {
        username: newUsername,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to update username");
      }

      toast.success("Username updated successfully");
      await update();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading((prev) => ({ ...prev, username: false }));
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, password: true }));

    const formData = new FormData(e.target);
    const result = await changePassword(null, formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success);
      e.target.reset();
    }
    setLoading((prev) => ({ ...prev, password: false }));
  };

  const handleDeleteAccount = async () => {
    setShowDeleteDialog(false);
    setLoading((prev) => ({ ...prev, delete: true }));
    const result = await deleteAccount();

    if (result.error) {
      toast.error(result.error);
      setLoading((prev) => ({ ...prev, delete: false }));
    } else {
      toast.success(result.success);
      window.location.href = "/api/auth/signout?callbackUrl=/";
    }
  };

  return (
    <main className="app-container">
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-zinc-100 pb-6 sm:flex-row sm:items-end dark:border-zinc-900">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
            Account Settings
          </h1>
          <p className="text-sm text-zinc-500">
            Manage your account settings and security preferences.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Username Section */}
        <Card>
          <CardHeader>
            <CardTitle>Username</CardTitle>
            <CardDescription>
              This is your public identifier. You can only change it once every
              30 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleUsernameChange}
              className="max-w-md space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="username">New Username</Label>
                <Input
                  id="username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="username"
                />
              </div>
              <Button
                type="submit"
                disabled={
                  loading.username ||
                  newUsername === user?.username ||
                  !newUsername
                }
              >
                {loading.username && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Username
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password Section */}
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handlePasswordChange}
              className="max-w-md space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading.password}>
                {loading.password && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Permanently delete your account and all of your content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={loading.delete}
            >
              {loading.delete && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
