"use server";

import { getCurrentProfile } from "@/lib/data/current-profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const saveSchema = z.object({
  mode: z.enum(["continue", "final"]),
  reqId: z.string(),
  srNo: z.string(),
  materialCode: z.string(),
  description: z.string(),
  materialGroup: z.string().optional(),
  materialType: z.string().optional(),
  qtyReq: z.number(),
  uom: z.string(),
  purpose: z.string(),
  createdBy: z.string(),
  plant: z.string(),
  department: z.string(),
  role: z.string(),
});

export async function saveMaterialRequestAction(
  _: unknown,
  formData: FormData,
) {
  const user = await getCurrentProfile();

  const raw = Object.fromEntries(formData.entries());
  const parsed = saveSchema.safeParse({
    mode: raw.mode,
    reqId: raw.reqId,
    srNo: raw.srNo,
    materialCode: raw.materialCode,
    description: raw.description,
    materialGroup: raw.materialGroup || undefined,
    materialType: raw.materialType || undefined,
    qtyReq: Number(raw.qtyReq),
    uom: raw.uom,
    purpose: raw.purpose,
    createdBy: user?.email,
    plant: user?.plant,
    department: user?.department,
    role: user?.role,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("material_requests").insert({
    req_id: parsed.data.reqId,
    sr_no: Number(parsed.data.srNo),
    material_code: parsed.data.materialCode,
    description: parsed.data.description,
    material_group: parsed.data.materialGroup ?? null,
    material_type: parsed.data.materialType ?? null,
    qty_req: parsed.data.qtyReq,
    uom: parsed.data.uom,
    purpose: parsed.data.purpose,
    status: "pending",
    created_by: parsed.data.createdBy,
    plant: parsed.data.plant,
    department: parsed.data.department,
    role: parsed.data.role,
  });

  if (error) return { error: error.message };

  revalidatePath("/mr-menu/mr-request-v3");

  return {
    success: true,
    mode: parsed.data.mode,
    reqId: parsed.data.reqId,
  };
}
