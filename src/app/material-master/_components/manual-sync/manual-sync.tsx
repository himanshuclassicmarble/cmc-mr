"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { triggerManualSync } from "./action";

export default function SyncMaterialsButton() {
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);

    toast.loading("Syncing materials from SAP...", { id: "sync-materials" });

    try {
      const result = await triggerManualSync();

      if (result.success) {
        toast.success(
          `Successfully synced ${result.successCount} of ${result.total} materials`,
          {
            id: "sync-materials",
            description: `Completed in ${result.duration}`,
            duration: 5000,
          },
        );
      } else {
        toast.error("Sync failed", {
          id: "sync-materials",
          description: result.error || "Unknown error occurred",
          duration: 5000,
        });
      }
    } catch (error) {
      toast.error("Sync failed", {
        id: "sync-materials",
        description: "An unexpected error occurred",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={loading} variant="outline" size="sm">
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          {loading ? "Syncing..." : "Sync Materials"}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sync materials from SAP?</AlertDialogTitle>
          <AlertDialogDescription>
            This will fetch all materials from SAP ECC and update the database.
            This may take a few minutes.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSync}>Sync Now</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
