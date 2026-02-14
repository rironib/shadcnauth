"use client";

import DynamicMetadata from "@/components/app/dynamic-metadata";
import { Button } from "@/components/ui/button";
import { atomic_age } from "@/config/fonts";
import { ArrowLeft, Compass, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <DynamicMetadata
        title="404 - Page Not Found"
        description="The page you are looking for doesn't exist or has been moved."
      />
      <div className="flex min-h-[720px] flex-col bg-background text-foreground selection:bg-primary/30 md:min-h-screen">
        <main className="relative flex flex-1 items-center justify-center overflow-hidden p-6 md:p-12">
          {/* Dynamic Background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 -left-20 h-[500px] w-[500px] animate-pulse rounded-full bg-primary/10 blur-[150px]" />
            <div
              className="absolute -right-20 bottom-1/4 h-[500px] w-[500px] animate-pulse rounded-full bg-primary/10 blur-[150px]"
              style={{ animationDelay: "2s" }}
            />

            {/* Floating SVG Particles */}
            <div className="absolute top-20 right-20 h-4 w-4 animate-bounce rounded-full bg-primary/20 blur-sm" />
            <div className="absolute bottom-40 left-40 h-3 w-3 animate-pulse rounded-full bg-primary/30 blur-sm" />
            <div className="absolute top-1/2 left-20 h-2 w-2 animate-ping rounded-full bg-primary/40 blur-[1px]" />
          </div>

          <div className="relative z-10 mt-[-40px] grid w-full max-w-6xl items-center gap-8 md:gap-16 lg:grid-cols-2">
            {/* Visual Side (Typographic 404) */}
            <div className="group pointer-events-none relative order-1 flex items-center justify-center select-none lg:order-2">
              <div className="absolute -inset-20 rounded-full bg-primary/5 opacity-50 blur-3xl transition-opacity duration-1000 group-hover:opacity-100" />

              <div className="relative flex flex-col items-center">
                <span
                  className={`${atomic_age.className} animate-in bg-gradient-to-br from-primary via-primary/50 to-primary/10 bg-clip-text text-[120px] leading-none font-black tracking-tighter text-transparent drop-shadow-[0_0_40px_rgba(var(--primary),0.3)] duration-1000 fade-in zoom-in md:text-[180px] lg:text-[280px]`}
                >
                  404
                </span>
                <div className="pointer-events-none absolute inset-0 flex translate-y-2 scale-110 items-center justify-center opacity-10 blur-[2px] md:translate-y-4">
                  <span
                    className={`${atomic_age.className} text-[120px] leading-none font-black tracking-tighter text-primary md:text-[180px] lg:text-[280px]`}
                  >
                    404
                  </span>
                </div>
                <div className="mt-[-10px] flex items-center gap-4 text-primary/40 md:mt-[-20px] lg:mt-[-40px]">
                  <span className="h-[2px] w-8 bg-gradient-to-r from-transparent to-primary/40 md:w-12 lg:w-24" />
                  <Compass className="animate-spin-slow h-4 w-4 md:h-6 md:w-6" />
                  <span className="h-[2px] w-8 bg-gradient-to-l from-transparent to-primary/40 md:w-12 lg:w-24" />
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
              <h1 className="mb-4 animate-in text-3xl leading-[1.1] font-bold tracking-tight delay-100 duration-700 slide-in-from-left md:mb-6 md:text-5xl lg:text-7xl">
                You&apos;ve reached the{" "}
                <span className="text-primary italic">edge</span> of the map.
              </h1>

              <p className="mb-8 max-w-lg animate-in text-base leading-relaxed text-muted-foreground delay-200 duration-700 slide-in-from-left md:mb-12 md:text-xl">
                Whether it was a broken link or a typo, you ended up in a place
                that doesn&apos;t exist. Let&apos;s get you back to familiar
                territory.
              </p>

              <div className="flex w-full animate-in flex-col flex-wrap justify-center gap-4 delay-300 duration-700 fade-in slide-in-from-bottom sm:w-auto sm:flex-row md:gap-5 lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="group h-12 w-full rounded-xl px-8 text-sm font-semibold shadow-2xl shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/40 sm:w-auto md:h-14 md:rounded-2xl md:px-10 md:text-base"
                >
                  <Link href="/" className="gap-3">
                    <Home className="h-4 w-4 transition-transform group-hover:scale-110 md:h-5 md:w-5" />
                    Back to Home
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="group h-12 w-full rounded-xl border-border/50 px-8 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:bg-secondary/50 sm:w-auto md:h-14 md:rounded-2xl md:px-10 md:text-base"
                  onClick={() =>
                    typeof window !== "undefined" && window.history.back()
                  }
                >
                  <span className="flex items-center gap-3">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 md:h-5 md:w-5" />
                    Go Back
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <style jsx global>{`
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
        `}</style>
      </div>
    </>
  );
}
