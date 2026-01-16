import { LinkSchemaType } from "@/app/vendor-form/link-generator/schema/schema";
import { createSupabaseServerClient } from "../supabase/server";

export async function getLinkTable(): Promise<LinkSchemaType[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("vendor_form_links")
    .select(
      `
      id,
      token,
      created_by_email,
      department,
      plant,
      emp_code,
      status,
      expires_at,
      created_at
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch Table Link:", error.message);
    throw new Error("Failed to load Links");
  }

  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    token: row.token,
    createdByEmail: row.created_by_email,
    department: row.department,
    plant: row.plant,
    empCode: row.emp_code,
    status: row.status,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  }));
}
