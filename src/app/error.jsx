"use client";

import { ErrorBoundary } from "@/components/error-boundary";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorBoundary fallback={null}>
      <div className="hidden">Trigger error boundary if needed</div>
      <ErrorUI error={error} reset={reset} />
    </ErrorBoundary>
  );
}

function ErrorUI({ error, reset }) {
  throw error;
}
