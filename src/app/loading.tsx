"use client";

import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Skeleton className="flex flex-col items-center gap-4 px-8 py-6 shadow-sm">
        <Spinner className="h-6 w-6" />

        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-foreground">Loading</p>
          <p className="text-xs text-muted-foreground">
            Please wait while we prepare your data
          </p>
        </div>
      </Skeleton>
    </div>
  );
}
