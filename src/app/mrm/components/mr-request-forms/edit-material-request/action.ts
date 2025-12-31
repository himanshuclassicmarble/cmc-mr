"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateSchema = z.object({
  reqId: z.string(),
  srNo: z.string(),

  materialCode: z.string(),
  description: z.string(),

  materialGroup: z.string(),
  materialType: z.string(),

  qtyReq: z.number().min(0),
  uom: z.string(),
  purpose: z.string(),
});

export async function updateMaterialRequestAction(
  _: unknown,
  formData: FormData,
) {
  const raw = Object.fromEntries(formData.entries());

  const parsed = updateSchema.safeParse({
    reqId: raw.reqId,
    srNo: raw.srNo,

    materialCode: raw.materialCode,
    description: raw.description,

    materialGroup: raw.materialGroup,
    materialType: raw.materialType,

    qtyReq: Number(raw.qtyReq),
    uom: raw.uom,
    purpose: raw.purpose,
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("material_requests")
    .update({
      material_code: parsed.data.materialCode,
      description: parsed.data.description,
      material_group: parsed.data.materialGroup,
      material_type: parsed.data.materialType,
      qty_req: parsed.data.qtyReq,
      uom: parsed.data.uom,
      purpose: parsed.data.purpose,
    })
    .eq("req_id", parsed.data.reqId)
    .eq("sr_no", Number(parsed.data.srNo));

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/mr-menu/mr-request-v3");

  return {
    success: true,
    reqId: parsed.data.reqId,
    srNo: parsed.data.srNo,
  };
}
