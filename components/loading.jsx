"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ className }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
        className,
      )}
    >
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
};

export default LoadingSpinner;
