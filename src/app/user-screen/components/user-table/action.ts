"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generatePassword } from "../../lib/password";
import { sendCredentialsEmail } from "../../lib/mailer";

const uuidSchema = z.string().uuid();
export async function resetUserPasswordByAdmin(userId: string) {
  try {
    if (!uuidSchema.safeParse(userId).success) {
      return { error: "Invalid user ID (not UUID)" };
    }
    const supabase = await createSupabaseServerClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      return { error: "Unauthorized" };
    }
    const { data: adminProfile, error: roleError } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", currentUser.id)
      .single();

    if (roleError || adminProfile?.role !== "admin") {
      return { error: "Only admins can reset passwords" };
    }
    const { data: authData, error: authUserError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (authUserError || !authData.user) {
      return { error: "User not found in authentication system" };
    }

    const email = authData.user.email ?? null;

    const newPassword = generatePassword();

    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword,
      });

    if (updateError) {
      return { error: updateError.message };
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ must_change_password: true })
      .eq("user_id", userId);

    if (profileError) {
      return { error: profileError.message };
    }

    if (!email) {
      return {
        success: true,
        warning:
          "Password reset successfully, but user has no email. Share credentials manually.",
      };
    }

    try {
      await sendCredentialsEmail(email, newPassword);
    } catch (emailError) {
      console.error("Email failed:", emailError);
      return {
        success: true,
        warning:
          "Password reset successfully, but email delivery failed. Share credentials manually.",
      };
    }

    return {
      success: true,
      message: "Password reset successfully and credentials sent",
    };
  } catch (error) {
    console.error("resetUserPasswordByAdmin error:", error);
    return {
      error: error instanceof Error ? error.message : "Unexpected server error",
    };
  }
}
