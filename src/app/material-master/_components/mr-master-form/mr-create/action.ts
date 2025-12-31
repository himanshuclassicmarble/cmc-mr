"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formSchema } from "../schema";
import { revalidatePath } from "next/cache";

export async function createMatMasterAction(_: unknown, formData: FormData) {
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

  const { error } = await supabase.from("material_master").insert({
    material_code: parsed.data.materialCode,
    material_type: parsed.data.materialType,
    material_group: parsed.data.materialGroup,
    uom: parsed.data.uom,
    material_description: parsed.data.materialDescription,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "This Material Code already exists." };
    }
    return { error: error.message };
  }

  revalidatePath("/mr-menu/material-master");
  return { success: true };
}
