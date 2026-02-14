import { ResetPasswordForm } from "@/components/auth/reset-form";
import { generateSeoMetadataServer } from "@/lib/seo";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("reset_password_page", {
    title: "Reset Password",
    description: "Reset your password to continue.",
  });
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[400px] items-center justify-center rounded-2xl border border-gray-800 bg-[#11161d] p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
