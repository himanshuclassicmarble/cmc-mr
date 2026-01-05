import { MaterialOption } from "@/app/mrm/components/mr-request-forms/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getMaterialOptionQuery(
  query?: string,
  limit: number = 10,
): Promise<MaterialOption[]> {
  const supabase = await createSupabaseServerClient();

  let dbQuery = supabase
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
    .order("created_at", { ascending: false })
    .limit(limit);

  if (query && query.trim()) {
    dbQuery = dbQuery.or(
      `material_description.ilike.%${query}%,material_code.ilike.%${query}%`,
    );
  }

  const { data, error } = await dbQuery;

  if (error) {
    console.error("Failed to fetch Material Master:", error.message);
    throw new Error("Failed to load materials");
  }

  if (!data) return [];

  return data.map((m) => ({
    materialCode: m.material_code,
    materialType: m.material_type,
    materialGroup: m.material_group,
    uom: m.uom,
    materialDescription: m.material_description,
  }));
}
