import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  department: z.string().optional(),
});

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(apiKey: string): boolean {
  const now = Date.now();
  const limit = 100;
  const windowMs = 60_000;

  const record = rateLimitMap.get(apiKey);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(apiKey, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (record.count >= limit) return true;

  record.count++;
  return false;
}

export async function GET(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey || apiKey !== process.env.SAP_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (isRateLimited(apiKey)) {
      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429 },
      );
    }

    /* 📥 Validate query */
    const { searchParams } = new URL(req.url);
    const parsed = QuerySchema.safeParse(Object.fromEntries(searchParams));

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid parameters" },
        { status: 400 },
      );
    }

    const { page, limit, department } = parsed.data;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const supabase = await createSupabaseServerClient();

    let query = supabase
      .from("material_requests")
      .select(
        `
        req_id,
        sr_no,
        material_code,
        description,
        material_group,
        material_type,
        qty_req,
        qty_approved,
        uom,
        purpose,
        approval_date,
        approved_by,
        department,
        created_at
      `,
        { count: "exact" },
      )
      .eq("status", "approved")
      .order("approval_date", { ascending: false })
      .range(from, to);

    if (department) {
      query = query.eq("department", department);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("[DB Error]", error);
      return NextResponse.json(
        { success: false, error: "Database error" },
        { status: 500 },
      );
    }

    const transformedData =
      data?.map((row) => ({
        request_id: `${row.req_id}-${row.sr_no}`,
        req_id: row.req_id,
        sr_no: row.sr_no,
        material_code: row.material_code,
        description: row.description,
        material_group: row.material_group,
        material_type: row.material_type,
        qty_req: row.qty_req,
        qty_approved: row.qty_approved,
        uom: row.uom,
        purpose: row.purpose,
        approval_date: row.approval_date,
        approved_by: row.approved_by,
        department: row.department,
        status: "Open",
      })) ?? [];

    return NextResponse.json({
      success: true,
      meta: {
        page,
        limit,
        total: count ?? 0,
        totalPages: count ? Math.ceil(count / limit) : 0,
      },
      data: transformedData,
    });
  } catch (err) {
    console.error("[API Error]", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
