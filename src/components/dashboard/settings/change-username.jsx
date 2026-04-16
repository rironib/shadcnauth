"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/use-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const usernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-z0-9_]+$/,
      "Username can only contain lowercase letters, numbers, and underscores",
    ),
});

export function ChangeUsername() {
  const { session, user, update } = useUser();
  const [isPending, setIsPending] = useState(false);
  const [remainingDays, setRemainingDays] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: "",
    },
  });

  useEffect(() => {
    if (user?.username) {
      setValue("username", user.username);
    }

    // Check for change limit
    const checkLimit = async () => {
      if (user?.id) {
        try {
          const res = await fetch(`/api/user/profile/${user.id}`);
          const userData = await res.json();
          if (userData.usernameLastChanged) {
            const lastChanged = new Date(userData.usernameLastChanged);
            const now = new Date();
            const daysSinceChange = Math.floor(
              (now - lastChanged) / (1000 * 60 * 60 * 24),
            );
            if (daysSinceChange < 30) {
              setRemainingDays(30 - daysSinceChange);
            }
          }
        } catch (error) {
          console.error("Error checking username limit:", error);
        }
      }
    };
    checkLimit();
  }, [user, setValue]);

  const onSubmit = async (data) => {
    if (!user?.id) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    setIsPending(true);
    try {
      const res = await fetch(`/api/user/profile/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: data.username }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Username updated successfully!");
        // Refresh the session to reflect the new username globally
        await update({
          ...session,
          user: {
            ...user,
            username: data.username,
          },
        });
      } else {
        toast.error(result || "Failed to update username.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-6 flex items-center gap-2">
        <div className="rounded-lg bg-primary/10 p-2">
          <UserIcon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Change Username</h2>
          <p className="text-sm text-muted-foreground">
            Update your public username
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">New Username</Label>
          <Input
            id="username"
            placeholder="johndoe"
            {...register("username")}
            disabled={remainingDays > 0 || isPending}
          />
          {errors.username && (
            <p className="text-sm font-medium text-destructive">
              {errors.username.message}
            </p>
          )}
          <p className="text-[12px] leading-tight text-muted-foreground">
            Use 3-30 characters with letters, numbers, and underscores only
            (lowercase).
            <br />
            {remainingDays > 0 ? (
              <span className="font-medium text-destructive">
                You can change your username again in {remainingDays} days.
              </span>
            ) : (
              <div className="space-y-1">
                <p>
                  <strong>Note:</strong> You can only change your username once
                  every 30 days.
                </p>
                <p className="text-primary/80">
                  Every username you use is reserved for you for life and cannot
                  be used by others.
                </p>
              </div>
            )}
          </p>
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={isPending || remainingDays > 0}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Username"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
