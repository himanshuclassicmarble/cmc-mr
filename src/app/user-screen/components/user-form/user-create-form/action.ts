"use server";

import { revalidatePath } from "next/cache";
import { formSchema } from "../../schema";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendCredentialsEmail } from "@/app/user-screen/lib/mailer";
import { generatePassword } from "@/app/user-screen/lib/password";

export async function createUserAndProfileAction(
  _: unknown,
  formData: FormData,
) {
  try {
    const supabase = await createSupabaseServerClient();

    const raw = Object.fromEntries(formData.entries());

    const creationSchema = formSchema.omit({ authUserId: true });
    const parsed = creationSchema.safeParse({
      email: raw.email,
      userName: raw.userName,
      empCode: raw.empCode,
      department: raw.department,
      plant: raw.plant,
      role: raw.role,
      hod: raw.hod || undefined,
      isActive: raw.isActive === "true" || raw.isActive === "on",
    });

    if (!parsed.success) {
      return {
        error: parsed.error.issues.map((i) => i.message).join(", "),
      };
    }

    const { email, userName, empCode, department, plant, role, isActive, hod } =
      parsed.data;

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (existingProfile) {
      return { error: "A user with this email already exists" };
    }

    const password = generatePassword();
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: userName },
      });

    if (authError || !authData.user) {
      return { error: authError?.message ?? "Failed to create user account" };
    }

    const newAuthUserId = authData.user.id;

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    const createdBy = currentUser?.id ?? "system";

    const { error: profileError } = await supabase.from("profiles").insert({
      user_id: newAuthUserId,
      email: email,
      user_name: userName,
      emp_code: empCode,
      department: department,
      plant: plant,
      role: role,
      hod: hod,
      is_active: isActive,
      must_change_password: true,
      created_by: createdBy,
    });

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(newAuthUserId);
      return { error: `Failed to create profile: ${profileError.message}` };
    }

    try {
      await sendCredentialsEmail(email, password);
    } catch (err) {
      console.error("Email failed:", err);
      return {
        success: true,
        warning: "User created but welcome email failed to send.",
        authUserId: newAuthUserId,
      };
    }

    revalidatePath("/mr-menu/user-screen");

    return {
      success: true,
      message: "User created and credentials sent",
      authUserId: newAuthUserId,
    };
  } catch (error) {
    console.error("createUserAndProfileAction error:", error);
    return {
      error: error instanceof Error ? error.message : "Unexpected server error",
    };
  }
}
