"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formSchema } from "../schema";
import { revalidatePath } from "next/cache";

export async function updateMatMasterAction(_: unknown, formData: FormData) {
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

  const { error } = await supabase
    .from("material_master")
    .update({
      material_type: parsed.data.materialType,
      material_group: parsed.data.materialGroup,
      uom: parsed.data.uom,
      material_description: parsed.data.materialDescription,
    })
    .eq("material_code", parsed.data.materialCode);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/mr-menu/material-master");
  return { success: true };
}
