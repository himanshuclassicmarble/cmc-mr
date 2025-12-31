"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createReqId(): Promise<string> {
  const supabase = await createSupabaseServerClient();

  const year = new Date().getFullYear().toString().slice(-2);
  const prefix = `MR${year}`;

  const { data, error } = await supabase
    .from("material_requests")
    .select("req_id")
    .like("req_id", `${prefix}%`)
    .order("req_id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("ReqId fetch error:", error.message);
    throw new Error("Failed to generate request id");
  }

  let next = 1;

  if (data?.req_id) {
    const lastNumber = Number(data.req_id.slice(prefix.length));
    if (!Number.isNaN(lastNumber)) {
      next = lastNumber + 1;
    }
  }

  return `${prefix}${String(next).padStart(6, "0")}`;
}
