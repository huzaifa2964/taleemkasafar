"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toggleEntryTestActive, deleteEntryTest } from "@/app/admin/entry-tests/actions";
import type { AdminEntryTest } from "@/lib/queries/admin-entry-tests";

type EntryTestsTableProps = {
  entryTests: AdminEntryTest[];
};

export function EntryTestsTable({ entryTests }: EntryTestsTableProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setLoading(id);
    setError(null);

    try {
      const result = await toggleEntryTestActive(id, !currentStatus);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || "Failed to toggle status");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(id);
    setError(null);

    try {
      const result = await deleteEntryTest(id);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || "Failed to delete entry test");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subjects
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Questions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Blueprints
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entryTests.map((test) => (
              <tr key={test.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{test.name}</div>
                    {test.source && (
                      <div className="text-xs text-gray-500">Source: {test.source}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">{test.slug}</code>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {test.subjects_count || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {test.questions_count || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {test.blueprints_count || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleActive(test.id, test.is_active)}
                    disabled={loading === test.id}
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      test.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    } ${loading === test.id ? "opacity-50 cursor-not-allowed" : "hover:opacity-80 cursor-pointer"}`}
                  >
                    {test.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/entry-tests/${test.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/entry-tests/${test.id}/blueprints`}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      Blueprints
                    </Link>
                    <button
                      onClick={() => handleDelete(test.id, test.name)}
                      disabled={loading === test.id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
