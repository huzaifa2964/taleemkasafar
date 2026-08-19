import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

/**
 * Admin login page.
 * Redirects to /admin if already logged in as admin.
 */
export default async function AdminLoginPage() {
  const supabase = await createClient();

  // Check if user is already authenticated and is an admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is logged in, check if they're an admin
  let currentUser = user;
  if (user) {
    const { data: adminData } = await supabase
      .from("admins")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();

    if (adminData) {
      // Already logged in as admin, redirect to dashboard
      redirect("/admin");
    }
    // If logged in but not admin, show login form anyway
    // They might want to sign out and sign in with admin account
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-2">
              Sign in to access the admin panel
            </p>
          </div>
          
          {currentUser && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> You're currently logged in as {currentUser.email}.
                <br />
                If this is not an admin account, please sign out first.
              </p>
              <form action="/admin/logout" method="post" className="mt-3">
                <button
                  type="submit"
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Sign out and try different account
                </button>
              </form>
            </div>
          )}
          
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
