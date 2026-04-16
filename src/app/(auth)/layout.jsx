import { atomic_age } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted px-2 py-6 sm:px-3 md:px-4 lg:px-6 xl:px-0">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Link
          href="/"
          className={cn(
            atomic_age.className,
            "text-center text-2xl font-bold tracking-tighter text-foreground md:text-2xl",
          )}
        >
          {siteConfig.name}
        </Link>
        <div className={cn("flex flex-col gap-6")}>
          {children}
          <p className="px-6 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link href="/page/tos" className="hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/page/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
