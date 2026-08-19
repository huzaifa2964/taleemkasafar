"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdminUser } from "@/lib/queries/admin-users";
import {
  banUser,
  unbanUser,
  deleteUser,
  sendPasswordReset,
} from "@/app/admin/users/actions";

type UsersTableProps = {
  users: AdminUser[];
  currentPage: number;
  totalPages: number;
};

/**
 * Table displaying all users with management actions.
 */
export function UsersTable({
  users,
  currentPage,
  totalPages,
}: UsersTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [actioningUserId, setActioningUserId] = useState<string | null>(null);

  const handleBan = async (userId: string) => {
    if (!confirm("Ban this user for 30 days?")) return;

    setActioningUserId(userId);
    const result = await banUser(userId, 30);

    if (result.success) {
      startTransition(() => router.refresh());
    } else {
      alert(`Failed to ban user: ${result.error}`);
    }
    setActioningUserId(null);
  };

  const handleUnban = async (userId: string) => {
    setActioningUserId(userId);
    const result = await unbanUser(userId);

    if (result.success) {
      startTransition(() => router.refresh());
    } else {
      alert(`Failed to unban user: ${result.error}`);
    }
    setActioningUserId(null);
  };

  const handleDelete = async (userId: string, email: string) => {
    if (
      !confirm(
        `PERMANENTLY DELETE user ${email}?\n\nThis action cannot be undone and will delete:\n- User account\n- All attempts and progress\n- All bookmarks\n\nType DELETE to confirm`
      )
    ) {
      return;
    }

    setActioningUserId(userId);
    const result = await deleteUser(userId);

    if (result.success) {
      startTransition(() => router.refresh());
    } else {
      alert(`Failed to delete user: ${result.error}`);
    }
    setActioningUserId(null);
  };

  const handlePasswordReset = async (email: string) => {
    if (!confirm(`Send password reset email to ${email}?`)) return;

    setActioningUserId(email);
    const result = await sendPasswordReset(email);

    if (result.success) {
      alert("Password reset email sent successfully");
    } else {
      alert(`Failed to send reset email: ${result.error}`);
    }
    setActioningUserId(null);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());
    startTransition(() => {
      router.push(`/admin/users?${params.toString()}`);
    });
  };

  if (users.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-gray-500">
        No users found
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stats
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Sign In
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => {
              const isBanned = user.banned_until
                ? new Date(user.banned_until) > new Date()
                : false;
              const isActioning = actioningUserId === user.id;

              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.email}
                        </div>
                        {user.display_name && (
                          <div className="text-sm text-gray-500">
                            {user.display_name}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isBanned ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        Banned
                      </span>
                    ) : user.email_confirmed_at ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{user.total_attempts || 0} attempts</div>
                    <div className="text-xs text-gray-400">
                      {user.total_mocks || 0} mocks
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {isBanned ? (
                        <button
                          onClick={() => handleUnban(user.id)}
                          disabled={isActioning || isPending}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          Unban
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBan(user.id)}
                          disabled={isActioning || isPending}
                          className="text-orange-600 hover:text-orange-900 disabled:opacity-50"
                        >
                          Ban
                        </button>
                      )}
                      <button
                        onClick={() => handlePasswordReset(user.email)}
                        disabled={isActioning || isPending}
                        className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.email)}
                        disabled={isActioning || isPending}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isPending}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isPending}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
