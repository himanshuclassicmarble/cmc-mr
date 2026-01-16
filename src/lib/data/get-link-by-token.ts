import { createSupabaseServerClient } from "../supabase/server";
import { LinkSchemaType } from "@/app/vendor-form/link-generator/schema/schema";

export async function getLinkByToken(
  token: string,
): Promise<LinkSchemaType | null> {
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
    .eq("token", token)
    .single();

  if (error) {
    // token not found OR DB error
    return null;
  }

  return {
    id: data.id,
    token: data.token,
    createdByEmail: data.created_by_email,
    department: data.department,
    plant: data.plant,
    empCode: data.emp_code,
    status: data.status,
    expiresAt: data.expires_at,
    createdAt: data.created_at,
  };
}
