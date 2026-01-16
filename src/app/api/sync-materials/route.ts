// app/api/sap/sync-materials/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface SAPMaterial {
  index: number;
  materialCode: string;
  materialType: string;
  materialGroup: string;
  uom: string;
  materialDescription: string;
}

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    // Security: Verify cron secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error("Unauthorized sync attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🔄 Starting SAP material sync...");

    // Fetch data from SAP ECC
    const sapAuth = Buffer.from(
      `${process.env.SAP_ECC_USERNAME}:${process.env.SAP_ECC_PASSWORD}`,
    ).toString("base64");

    const sapUrl = `${process.env.SAP_ECC_BASE_URL}${process.env.SAP_ECC_MATERIAL_SYNC_PATH}?sap-client=${process.env.SAP_ECC_CLIENT}`;

    const sapResponse = await fetch(sapUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${sapAuth}`,
      },
      signal: AbortSignal.timeout(60000), // 60 second timeout
    });

    if (!sapResponse.ok) {
      const errorText = await sapResponse.text();
      throw new Error(`SAP API error: ${sapResponse.status} - ${errorText}`);
    }

    const materials: SAPMaterial[] = await sapResponse.json();

    if (!Array.isArray(materials) || materials.length === 0) {
      console.log("⚠️ No materials received from SAP");

      await supabase.from("sync_logs").insert({
        sync_type: "material_master",
        total_records: 0,
        success_count: 0,
        error_count: 0,
        sync_status: "no_data",
        synced_at: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: "No materials to sync",
        count: 0,
      });
    }

    console.log(`📦 Received ${materials.length} materials from SAP`);

    // Transform data to match Supabase schema
    const transformedMaterials = materials
      .map((mat) => ({
        material_code: mat.materialCode?.trim(),
        material_type: mat.materialType?.trim(),
        material_group: mat.materialGroup?.trim(),
        uom: mat.uom?.trim(),
        material_description: mat.materialDescription?.trim(),
        last_synced_at: new Date().toISOString(),
        sync_source: "SAP_ECC_AUTO",
      }))
      .filter((mat) => mat.material_code); // Remove invalid entries

    console.log(
      `✅ Transformed ${transformedMaterials.length} valid materials`,
    );

    // Batch upsert in chunks (Supabase recommends max 1000 per request)
    const chunkSize = 500;
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < transformedMaterials.length; i += chunkSize) {
      const chunk = transformedMaterials.slice(i, i + chunkSize);
      const chunkNumber = Math.floor(i / chunkSize) + 1;
      const totalChunks = Math.ceil(transformedMaterials.length / chunkSize);

      console.log(
        `📝 Processing chunk ${chunkNumber}/${totalChunks} (${chunk.length} records)`,
      );

      const { error } = await supabase.from("material_master").upsert(chunk, {
        onConflict: "material_code",
        ignoreDuplicates: false, // Update existing records
      });

      if (error) {
        console.error(`❌ Error in chunk ${chunkNumber}:`, error);
        errorCount += chunk.length;
        errors.push(`Chunk ${chunkNumber}: ${error.message}`);
      } else {
        successCount += chunk.length;
        console.log(`✅ Chunk ${chunkNumber} completed successfully`);
      }
    }

    const duration = Date.now() - startTime;

    // Log sync results
    await supabase.from("sync_logs").insert({
      sync_type: "material_master",
      total_records: materials.length,
      success_count: successCount,
      error_count: errorCount,
      sync_status: errorCount > 0 ? "partial_success" : "success",
      error_message: errors.length > 0 ? errors.join("; ") : null,
      synced_at: new Date().toISOString(),
    });

    console.log(`
🎉 Sync completed in ${duration}ms
   Total: ${materials.length}
   Success: ${successCount}
   Errors: ${errorCount}
    `);

    return NextResponse.json({
      success: true,
      message: "Material sync completed",
      total: materials.length,
      successCount,
      errorCount,
      duration: `${duration}ms`,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error("💥 SAP sync failed:", error);

    // Log error
    await supabase.from("sync_logs").insert({
      sync_type: "material_master",
      sync_status: "failed",
      error_message: error instanceof Error ? error.message : "Unknown error",
      synced_at: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: `${duration}ms`,
      },
      { status: 500 },
    );
  }
}

// Manual trigger endpoint (for testing)
export async function GET(request: Request) {
  // Allow manual trigger from authenticated admin users
  const url = new URL(request.url);
  const manualKey = url.searchParams.get("key");

  if (manualKey !== process.env.MANUAL_SYNC_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Create a new request with the cron secret
  const mockRequest = new Request(request.url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.CRON_SECRET}`,
    },
  });

  return POST(mockRequest);
}
