import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin logout route handler.
 * Signs out the user and redirects to admin login page.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Sign out the user
  await supabase.auth.signOut();

  // Redirect to admin login
  return NextResponse.redirect(new URL("/admin/login", request.url));
}
