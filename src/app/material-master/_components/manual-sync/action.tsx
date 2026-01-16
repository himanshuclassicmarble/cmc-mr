// app/actions/sync-materials.ts
"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function triggerManualSync() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/sync-materials`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
      cache: "no-store",
    });

    // Always read as text first (safe)
    const rawText = await response.text();

    // Try parsing JSON (your API should return JSON)
    let data: any;
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      throw new Error("Invalid response from sync API");
    }

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Sync failed",
      };
    }

    return {
      success: true,
      ...data,
    };
  } catch (error) {
    console.error("Manual sync error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getSyncHistory(limit = 10) {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("sync_logs")
      .select("*")
      .order("synced_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Get sync history error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
