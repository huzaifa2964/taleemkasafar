"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AdminAuthState = {
  error: string | null;
};

/**
 * Server Action: Admin login with email/password.
 * Validates that the user exists in the admins table and is active.
 */
export async function adminLoginAction(
  _prev: AdminAuthState,
  formData: FormData
): Promise<AdminAuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await createClient();

  // Authenticate with Supabase Auth
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError || !authData.user) {
    return { error: "Invalid credentials" };
  }

  // Check if user is an active admin
  const { data: adminData, error: adminError } = await supabase
    .from("admins")
    .select("id, username, is_active")
    .eq("user_id", authData.user.id)
    .single();

  if (adminError || !adminData) {
    // User authenticated but is not an admin
    await supabase.auth.signOut();
    return { error: "Access denied: Admin privileges required" };
  }

  if (!adminData.is_active) {
    // Admin account is deactivated
    await supabase.auth.signOut();
    return { error: "Admin account is deactivated" };
  }

  // Update last login timestamp
  await supabase
    .from("admins")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", adminData.id);

  redirect("/admin");
}
