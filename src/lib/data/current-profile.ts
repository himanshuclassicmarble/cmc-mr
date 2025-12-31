import { UserFormSchema } from "@/app/user-screen/components/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentProfile(): Promise<UserFormSchema | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !profile) return null;

  return {
    authUserId: profile.user_id,
    email: profile.email,
    userName: profile.user_name,
    empCode: profile.emp_code,
    department: profile.department,
    plant: profile.plant,
    role: profile.role,
    hod: profile.hod ?? undefined,
    isActive: profile.is_active,
  };
}
