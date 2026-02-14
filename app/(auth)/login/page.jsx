import { LoginForm } from "@/components/auth/login-form";
import { generateSeoMetadataServer } from "@/lib/seo";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("login_page", {
    title: "Login - ShadcnUI Auth",
    description: "Login to your account to continue.",
  });
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[400px] items-center justify-center rounded-2xl border border-gray-800 bg-[#11161d] p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
