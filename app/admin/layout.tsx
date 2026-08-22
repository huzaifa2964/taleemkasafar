import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin layout with authentication guard.
 * Only users in the admins table with is_active=true can access.
 * Note: /admin/login is excluded from this layout check.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin-auth/login");
  }

  // Check if user is an active admin
  const { data: adminData } = await supabase
    .from("admins")
    .select("id, username, is_active")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  if (!adminData) {
    // User is authenticated but not an admin
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation Header */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Admin Panel - Taleem ka Safar
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {adminData.username}
              </span>
              <form action="/admin-auth/logout" method="post">
                <button
                  type="submit"
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Sidebar + Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            <a
              href="/admin"
              className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              📊 Dashboard
            </a>
            <a
              href="/admin/users"
              className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              👥 Users
            </a>
            <a
              href="/admin/entry-tests"
              className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              🎓 Entry Tests
            </a>
            <a
              href="/admin/questions"
              className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              📝 Questions
            </a>
            <a
              href="/admin/blogs"
              className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              ✍️ Blogs
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
