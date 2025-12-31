"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentProfile } from "@/lib/data/current-profile";

const approvalSchema = z.object({
  reqId: z.string(),
  srNo: z.number(),
  status: z.enum(["approved", "rejected"]),
  qtyReq: z.number().optional(),
  qtyApproved: z.number().nullable().optional(),
  approvalDate: z.string().optional(),
  rejectedDate: z.string().optional(),
  rejectReason: z.string().optional(),
});

export async function updateMRApprovalAction(_: unknown, formData: FormData) {
  const user = await getCurrentProfile();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const raw = Object.fromEntries(formData.entries());

  const parsed = approvalSchema.safeParse({
    reqId: raw.reqId,
    srNo: Number(raw.srNo),
    status: raw.status,
    qtyReq: raw.qtyReq ? Number(raw.qtyReq) : undefined,
    qtyApproved:
      raw.qtyApproved === ""
        ? null
        : raw.qtyApproved
          ? Number(raw.qtyApproved)
          : undefined,
    approvalDate: raw.approvalDate || undefined,
    rejectedDate: raw.rejectedDate || undefined,
    rejectReason: raw.rejectReason || undefined,
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  const supabase = await createSupabaseServerClient();

  /** 🔒 Build update payload safely */
  const updatePayload: Record<string, any> = {
    status: parsed.data.status,
  };

  if (parsed.data.qtyReq !== undefined) {
    updatePayload.qty_req = parsed.data.qtyReq;
  }

  if (parsed.data.status === "approved") {
    updatePayload.qty_approved = parsed.data.qtyApproved ?? 0;
    updatePayload.approved_by = user.email;
    updatePayload.approval_date =
      parsed.data.approvalDate ?? new Date().toISOString();
  }

  if (parsed.data.status === "rejected") {
    updatePayload.rejected_by = user.email;
    updatePayload.rejected_date =
      parsed.data.rejectedDate ?? new Date().toISOString();
    updatePayload.reject_reason = parsed.data.rejectReason ?? "Rejected";
  }

  /** 🔄 Update record */
  const { error } = await supabase
    .from("material_requests")
    .update(updatePayload)
    .eq("req_id", parsed.data.reqId)
    .eq("sr_no", parsed.data.srNo);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/mr-menu/mr-request-v3");

  return {
    success: true,
    reqId: parsed.data.reqId,
    srNo: parsed.data.srNo,
    status: parsed.data.status,
  };
}
