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
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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

  const { handleSubmit, control } = useForm({
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            control={control}
            name="token"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Verification Token</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    placeholder="Enter your token"
                    disabled={isLoading || !!success}
                  />
                  <FieldError errors={[fieldState.error]} />
                </FieldContent>
              </Field>
            )}
          />

          <div className="space-y-4">
            <Button
              type="submit"
              disabled={isLoading || !!success}
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
      </CardContent>
    </Card>
  );
};
