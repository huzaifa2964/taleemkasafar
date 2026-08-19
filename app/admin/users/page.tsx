import { getAllUsers } from "@/lib/queries/admin-users";
import { UsersTable } from "@/components/admin/users-table";
import { UserSearch } from "@/components/admin/user-search";
import { unstable_noStore as noStore } from "next/cache";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

/**
 * Admin users management page.
 * Displays all users with search, filter, and management options.
 */
export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  noStore(); // Opt out of caching for dynamic data
  
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const page = typeof params.page === "string" ? parseInt(params.page) : 1;

  const { users, total, totalPages } = await getAllUsers(search, page);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">
            View and manage all registered users
          </p>
        </div>
        <div className="text-sm text-gray-600">
          Total Users: <span className="font-bold">{total}</span>
        </div>
      </div>

      {/* Search Bar */}
      <UserSearch initialSearch={search} />

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow">
        <UsersTable users={users} currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
