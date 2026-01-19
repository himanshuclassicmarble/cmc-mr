"use server";
import { getCurrentProfile } from "@/lib/data/current-profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateSchema = z.object({
  reqId: z.string().min(1, "Request ID is required"),
  srNo: z.string().min(1, "SR number is required"),
  materialCode: z.string().min(1, "Material code is required"),
  description: z.string().min(1, "Description is required"),
  materialGroup: z.string().min(1, "Material group is required"),
  materialType: z.string().min(1, "Material type is required"),
  qtyReq: z.number().positive("Quantity must be greater than zero"),
  uom: z.string().min(1, "Unit of measurement is required"),
  purpose: z.string().min(1, "Purpose is required"),
});

export async function updateMaterialRequestAction(
  _: unknown,
  formData: FormData,
) {
  try {
    // 1. Authentication check
    const user = await getCurrentProfile();
    if (!user) {
      return { error: "Unauthorized. Please log in to continue." };
    }

    // 2. Parse and validate input
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

    // 3. Check if the request exists and user has permission to edit
    const { data: existingRequest, error: fetchError } = await supabase
      .from("material_requests")
      .select("req_id, sr_no, status, created_by")
      .eq("req_id", parsed.data.reqId)
      .eq("sr_no", Number(parsed.data.srNo))
      .single();

    if (fetchError || !existingRequest) {
      console.error("Fetch error:", fetchError);
      return {
        error: `Material request not found (${parsed.data.reqId} - ${parsed.data.srNo})`,
      };
    }

    // 4. Check if request is still editable (only pending requests can be edited)
    if (existingRequest.status !== "pending") {
      return {
        error: `Cannot edit ${existingRequest.status} requests. Only pending requests can be modified.`,
      };
    }

    // 5. Authorization check - only creator or admin/HOD can edit
    const isCreator = existingRequest.created_by === user.email;
    const isAuthorized = user.role === "hod" || user.role === "admin";

    if (!isCreator && !isAuthorized) {
      return {
        error: "Access denied. You can only edit your own requests.",
      };
    }

    // 6. Check if material code exists (if it's not a new material with code "0")
    if (parsed.data.materialCode !== "0") {
      const { data: materialExists } = await supabase
        .from("material_master")
        .select("material_code")
        .eq("material_code", parsed.data.materialCode)
        .single();

      if (!materialExists) {
        return {
          error: `Material code "${parsed.data.materialCode}" does not exist in master data.`,
        };
      }
    }

    // 7. Update the request
    const { data: updatedData, error: updateError } = await supabase
      .from("material_requests")
      .update({
        material_code: parsed.data.materialCode,
        description: parsed.data.description,
        material_group: parsed.data.materialGroup,
        material_type: parsed.data.materialType,
        qty_req: parsed.data.qtyReq,
        uom: parsed.data.uom,
        purpose: parsed.data.purpose,
        updated_by: user.email,
      })
      .eq("req_id", parsed.data.reqId)
      .eq("sr_no", Number(parsed.data.srNo))
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

      if (updateError.code === "23503") {
        return {
          error: "Invalid material code or related data",
        };
      }

      return {
        error: "Failed to update material request. Please try again.",
      };
    }

    if (!updatedData) {
      return {
        error: "Failed to update request. Please try again.",
      };
    }

    // 8. Revalidate the page
    revalidatePath("/mr-menu/mr-request-v3");

    // 9. Return success
    return {
      success: true,
      reqId: parsed.data.reqId,
      srNo: parsed.data.srNo,
      message: "Material request updated successfully",
    };
  } catch (error) {
    console.error("Unexpected error in updateMaterialRequestAction:", error);
    return {
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
