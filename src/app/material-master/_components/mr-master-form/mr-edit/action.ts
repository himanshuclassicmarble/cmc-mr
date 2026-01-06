"use server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formSchema } from "../schema";
import { revalidatePath } from "next/cache";

export async function updateMatMasterAction(_: unknown, formData: FormData) {
  try {
    const raw = Object.fromEntries(formData.entries());

    const parsed = formSchema.safeParse({
      materialCode: raw.materialCode,
      materialType: raw.materialType,
      materialGroup: raw.materialGroup,
      uom: raw.uom,
      materialDescription: raw.materialDescription,
    });

    if (!parsed.success) {
      return {
        error: parsed.error.issues.map((i) => i.message).join(", "),
      };
    }

    const supabase = await createSupabaseServerClient();

    // Get the original material code (you'll need to pass this separately)
    const originalMaterialCode = raw.originalMaterialCode as string;

    // Check if material exists before updating
    const { data: existing, error: fetchError } = await supabase
      .from("material_master")
      .select("material_code")
      .eq("material_code", originalMaterialCode)
      .single();

    if (fetchError || !existing) {
      return {
        error: `Material code "${originalMaterialCode}" not found. Cannot update.`,
      };
    }

    if (parsed.data.materialCode !== originalMaterialCode) {
      const { data: duplicate } = await supabase
        .from("material_master")
        .select("material_code")
        .eq("material_code", parsed.data.materialCode)
        .single();

      if (duplicate) {
        return {
          error: `Material code "${parsed.data.materialCode}" already exists. Please use a different code.`,
        };
      }
    }

    const { error } = await supabase
      .from("material_master")
      .update({
        material_code: parsed.data.materialCode,
        material_type: parsed.data.materialType,
        material_group: parsed.data.materialGroup,
        uom: parsed.data.uom,
        material_description: parsed.data.materialDescription,
      })
      .eq("material_code", originalMaterialCode);

    if (error) {
      console.error("Database error:", error);
      return { error: "Failed to update material. Please try again." };
    }

    revalidatePath("/mr-menu/material-master");
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in updateMatMasterAction:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
