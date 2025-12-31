"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { formSchema } from "../../schema";

export async function updateProfileAction(_: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  const parsed = formSchema.safeParse({
    authUserId: raw.authUserId,
    email: raw.email,
    userName: raw.userName,
    empCode: raw.empCode,
    department: raw.department,
    plant: raw.plant,
    role: raw.role,
    isActive: raw.isActive === "true" || raw.isActive === "on",
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      user_name: parsed.data.userName,
      emp_code: parsed.data.empCode,
      department: parsed.data.department,
      plant: parsed.data.plant,
      role: parsed.data.role,
      is_active: parsed.data.isActive,
    })
    .eq("email", parsed.data.email);

  if (error) return { error: error.message };

  revalidatePath("/mr-menu/user-screen");
  return { success: true, message: "Profile updated successfully" };
}
