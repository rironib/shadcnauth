import { VerifyUserForm } from "@/components/auth/verify-form";
import { generateSeoMetadataServer } from "@/lib/seo";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("verify_email_page", {
    title: "User verification - ShadcnUI Auth",
    description: "Verify your email address to continue.",
  });
};

export default function VerifyUserPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border bg-card p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <VerifyUserForm />
    </Suspense>
  );
}
