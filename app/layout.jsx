import { AuthProvider } from "@/components/auth-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import GoogleTagManager from "@/components/google-tag-manager";
import { ThemeProvider } from "@/components/theme-provider";
import { oxanium } from "@/config/fonts";
import { authOptions } from "@/lib/auth";
import { constructMetadata } from "@/lib/metadata";
import { env } from "@/lib/validateEnv";
import { getServerSession } from "next-auth/next";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

export const metadata = constructMetadata();

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
      <body
        className={`${oxanium.className} text-slate-700 dark:text-slate-300`}
      >
        <GoogleTagManager />

        {env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
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
