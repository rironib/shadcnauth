import { RegisterForm } from "@/components/auth/register-form";
import { generateSeoMetadataServer } from "@/lib/seo";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("register_page", {
    title: "Sign up - ShadcnUI Auth",
    description: "Create an account to continue.",
  });
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border bg-card p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
