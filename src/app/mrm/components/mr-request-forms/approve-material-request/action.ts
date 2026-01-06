"use server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentProfile } from "@/lib/data/current-profile";

const approvalSchema = z.object({
  reqId: z.string().min(1, "Request ID is required"),
  srNo: z.number().positive("SR number must be positive"),
  status: z.enum(["approved", "rejected"], {
    error: () => ({ message: "Status must be either approved or rejected" }),
  }),
  qtyReq: z
    .number()
    .nonnegative("Quantity requested must be non-negative")
    .optional(),
  qtyApproved: z
    .number()
    .nonnegative("Quantity approved must be non-negative")
    .nullable()
    .optional(),
  approvalDate: z.string().datetime().optional(),
  rejectedDate: z.string().datetime().optional(),
  rejectReason: z.string().min(1, "Rejection reason is required").optional(),
});

export async function updateMRApprovalAction(_: unknown, formData: FormData) {
  try {
    // 1. Authentication check
    const user = await getCurrentProfile();
    if (!user) {
      return { error: "Unauthorized. Please log in to continue." };
    }

    // 2. Check user authorization (HOD or Admin only)
    const isAuthorized = user.role === "hod" || user.role === "admin";
    if (!isAuthorized) {
      return {
        error: "Access denied. Only HOD or Admin can approve/reject requests.",
      };
    }

    // 3. Parse and validate input
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

    // 4. Additional business logic validation
    if (parsed.data.status === "approved") {
      if (
        parsed.data.qtyApproved === undefined ||
        parsed.data.qtyApproved === null
      ) {
        return { error: "Approved quantity is required for approval" };
      }

      if (parsed.data.qtyApproved <= 0) {
        return { error: "Approved quantity must be greater than zero" };
      }

      if (parsed.data.qtyReq && parsed.data.qtyApproved > parsed.data.qtyReq) {
        return {
          error: "Approved quantity cannot exceed requested quantity",
        };
      }
    }

    if (parsed.data.status === "rejected") {
      if (!parsed.data.rejectReason || !parsed.data.rejectReason.trim()) {
        return { error: "Rejection reason is required" };
      }
    }

    const supabase = await createSupabaseServerClient();

    // 5. Check if the request exists and is in pending state
    const { data: existingRequest, error: fetchError } = await supabase
      .from("material_requests")
      .select("status, req_id, sr_no")
      .eq("req_id", parsed.data.reqId)
      .eq("sr_no", parsed.data.srNo)
      .single();

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      return {
        error: `Material request not found (${parsed.data.reqId} - ${parsed.data.srNo})`,
      };
    }

    if (!existingRequest) {
      return {
        error: `Material request not found (${parsed.data.reqId} - ${parsed.data.srNo})`,
      };
    }

    // 6. Check if already processed
    if (existingRequest.status !== "pending") {
      return {
        error: `This request has already been ${existingRequest.status}`,
      };
    }

    // 7. Build update payload safely (without updated_at)
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
      // Clear rejection fields if any
      updatePayload.rejected_by = null;
      updatePayload.rejected_date = null;
      updatePayload.reject_reason = null;
    }

    if (parsed.data.status === "rejected") {
      updatePayload.rejected_by = user.email;
      updatePayload.rejected_date =
        parsed.data.rejectedDate ?? new Date().toISOString();
      updatePayload.reject_reason = parsed.data.rejectReason ?? "Rejected";
      // Clear approval fields if any
      updatePayload.approved_by = null;
      updatePayload.approval_date = null;
      updatePayload.qty_approved = null;
    }

    // 8. Update record
    const { data: updatedData, error: updateError } = await supabase
      .from("material_requests")
      .update(updatePayload)
      .eq("req_id", parsed.data.reqId)
      .eq("sr_no", parsed.data.srNo)
      .select()
      .single();

    if (updateError) {
      console.error("Update error:", updateError);

      // Handle specific database errors
      if (updateError.code === "PGRST116") {
        return {
          error: "Request not found or you don't have permission to update it",
        };
      }

      if (updateError.code === "PGRST204") {
        return {
          error: "Database schema error. Please contact support.",
        };
      }

      return {
        error: `Failed to ${parsed.data.status === "approved" ? "approve" : "reject"} request. Please try again.`,
      };
    }

    if (!updatedData) {
      return {
        error: "Failed to update request. Please try again.",
      };
    }

    // 9. Revalidate the page
    revalidatePath("/mr-menu/mr-request-v3");

    // 10. Return success with details
    return {
      success: true,
      reqId: parsed.data.reqId,
      srNo: parsed.data.srNo,
      status: parsed.data.status,
      message: `Request ${parsed.data.status === "approved" ? "approved" : "rejected"} successfully`,
    };
  } catch (error) {
    console.error("Unexpected error in updateMRApprovalAction:", error);
    return {
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
