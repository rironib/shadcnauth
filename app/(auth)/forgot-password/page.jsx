import { ForgotForm } from "@/components/auth/forgot-form";
import { generateSeoMetadataServer } from "@/lib/seo";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("forgot_password_page", {
    title: "Forgot Password - ShadcnUI Auth",
    description:
      "Forgot your password? No problem. Just let us know your email address and we will email you a link to reset your password.",
  });
};

export default function ForgotPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[400px] items-center justify-center rounded-2xl border border-gray-800 bg-[#11161d] p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <ForgotForm />
    </Suspense>
  );
}
