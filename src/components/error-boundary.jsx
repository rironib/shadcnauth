"use client";

import { Button } from "@/components/ui/button";
import { env } from "@/lib/validateEnv";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center space-y-6 bg-white p-2 text-center sm:p-4 md:p-6 lg:p-8 xl:p-12 dark:bg-zinc-950">
          <div className="rounded-full bg-red-50 p-4 dark:bg-red-900/10">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Something went wrong
            </h2>
            <p className="mx-auto max-w-[400px] text-sm text-zinc-500 dark:text-zinc-400">
              An unexpected error occurred in this section. Please verify your
              request or try again later.
            </p>
          </div>

          {env.NODE_ENV === "development" && this.state.error && (
            <div className="mt-4 max-w-full overflow-auto rounded-lg bg-zinc-100 p-4 text-left font-mono text-[10px] text-red-600 sm:text-xs dark:bg-zinc-900/50">
              <p className="font-bold underline decoration-red-500/30 underline-offset-4">
                {this.state.error.toString()}
              </p>
              <pre className="mt-2 whitespace-pre-wrap opacity-80">
                {this.state.error.stack}
              </pre>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => this.setState({ hasError: false })}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "/")}
              className="gap-2 opacity-70 hover:opacity-100"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
