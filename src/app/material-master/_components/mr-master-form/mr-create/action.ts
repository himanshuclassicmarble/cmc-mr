"use server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formSchema } from "../schema";
import { revalidatePath } from "next/cache";

export async function createMatMasterAction(_: unknown, formData: FormData) {
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

    // Check if material code already exists
    const { data: existing } = await supabase
      .from("material_master")
      .select("material_code")
      .eq("material_code", parsed.data.materialCode)
      .single();

    if (existing) {
      return {
        error: `Material code "${parsed.data.materialCode}" already exists. Please use a different code.`,
      };
    }

    const { error } = await supabase.from("material_master").insert({
      material_code: parsed.data.materialCode,
      material_type: parsed.data.materialType,
      material_group: parsed.data.materialGroup,
      uom: parsed.data.uom,
      material_description: parsed.data.materialDescription,
    });

    if (error) {
      // Handle duplicate key error (23505 is PostgreSQL unique violation)
      if (error.code === "23505") {
        return {
          error: `Material code "${parsed.data.materialCode}" already exists. Please use a different code.`,
        };
      }

      // Handle other database errors
      console.error("Database error:", error);
      return { error: "Failed to create material. Please try again." };
    }

    revalidatePath("/mr-menu/material-master");
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in createMatMasterAction:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
