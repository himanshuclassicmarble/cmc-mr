import {
  formSchema,
  UserFormSchema,
} from "@/app/user-screen/components/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/data/current-profile";

export async function getProfiles(): Promise<UserFormSchema[]> {
  const loggedUser = await getCurrentProfile();

  if (!loggedUser) {
    throw new Error("Unauthorized: No active session");
  }

  if (loggedUser.role?.toLowerCase() !== "admin") {
    console.warn(
      `Access denied: role=${loggedUser.role}, user=${loggedUser.authUserId}`,
    );
    throw new Error("Forbidden: Admin access only");
  }

  const supabase = await createSupabaseServerClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select(
      `
      user_id,
      email,
      user_name,
      emp_code,
      role,
      department,
      plant,
      hod,
      is_active,
      created_at
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch profiles:", error.message);
    throw new Error("Failed to load users");
  }

  if (!profiles || profiles.length === 0) return [];

  return profiles
    .map((u) => ({
      authUserId: u.user_id,
      email: u.email,
      userName: u.user_name,
      empCode: u.emp_code,
      department: u.department,
      plant: u.plant,
      role: u.role,
      hod: u.hod ?? undefined,
      isActive: u.is_active,
    }))
    .filter((u) => {
      const result = formSchema.safeParse(u);
      if (!result.success) {
        console.warn("Invalid user skipped:", result.error.flatten());
        return false;
      }
      return true;
    });
}
