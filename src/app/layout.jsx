import { AuthProvider } from "@/components/auth-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { ThemeProvider } from "@/components/theme-provider";
import { oxanium } from "@/config/fonts";
import { authOptions } from "@/lib/auth";
import { constructMetadata } from "@/lib/metadata";
import { env } from "@/lib/validateEnv";
import { getServerSession } from "next-auth/next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

import { Toaster } from "@/components/ui/sonner";

export const metadata = constructMetadata();

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
      <body
        className={`${oxanium.className} text-slate-700 dark:text-slate-300`}
      >
        <GoogleAnalytics gaId={`${env.NEXT_PUBLIC_GA_ID}`} />

        <AuthProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ErrorBoundary>{children}</ErrorBoundary>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
