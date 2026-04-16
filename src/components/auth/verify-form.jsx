"use client";

import { verifyEmailAction } from "@/actions/public/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const verifySchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export const VerifyUserForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const form = useForm({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      token: tokenFromUrl,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const result = await verifyEmailAction(data.token);

      if (result.success) {
        setSuccess("Email verified successfully! You can now login.");
      } else {
        setError(result.error || "Verification failed.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Verify Account</CardTitle>
        <CardDescription>
          Enter the verification token sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4 border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription className="text-xs font-semibold">
              {success}
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Token</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your token"
                      disabled={isLoading || success}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Button
                type="submit"
                disabled={isLoading || success}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>
              <div className="text-center text-sm">
                <Link
                  href="/login"
                  className="inline-flex items-center text-muted-foreground hover:underline"
                >
                  <ChevronLeft className="mr-1 h-3 w-3" />
                  Back to login
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
