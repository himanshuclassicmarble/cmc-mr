import { MRMasterSchema } from "@/app/material-master/_components/mr-master-form/schema";
import { createSupabaseServerClient } from "../supabase/server";

export async function getMaterialMaster(): Promise<MRMasterSchema[]> {
  const supabase = await createSupabaseServerClient();

  const { data: material_rows, error } = await supabase
    .from("material_master")
    .select(
      `
      material_code,
      material_type,
      material_group,
      uom,
      material_description
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch Material Master:", error.message);
    throw new Error("Failed to load Materials");
  }

  if (!material_rows) return [];

  return material_rows.map((m) => ({
    materialCode: m.material_code,
    materialType: m.material_type as MRMasterSchema["materialType"],
    materialGroup: m.material_group as MRMasterSchema["materialGroup"],
    uom: m.uom as MRMasterSchema["uom"],
    materialDescription: m.material_description,
  }));
}
