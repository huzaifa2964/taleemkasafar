"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { removeSubjectFromTest, updateTestSubject } from "@/app/admin/entry-tests/actions";

type TestSubject = {
  id: string;
  subject_id: string;
  subject_name?: string;
  nature_of_questions?: string;
  display_order: number;
  is_active: boolean;
  difficulty_profile?: Record<string, number>;
};

type TestSubjectsListProps = {
  testSubjects: TestSubject[];
};

export function TestSubjectsList({ testSubjects }: TestSubjectsListProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    nature_of_questions: "",
    display_order: 0,
    is_active: true,
  });

  const handleRemove = async (id: string, subjectName: string) => {
    if (!confirm(`Remove ${subjectName} from this entry test?`)) {
      return;
    }

    setLoading(id);
    setError(null);

    try {
      const result = await removeSubjectFromTest(id);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || "Failed to remove subject");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  const handleEdit = (testSubject: TestSubject) => {
    setEditingId(testSubject.id);
    setEditForm({
      nature_of_questions: testSubject.nature_of_questions || "",
      display_order: testSubject.display_order,
      is_active: testSubject.is_active,
    });
  };

  const handleUpdate = async (id: string) => {
    setLoading(id);
    setError(null);

    try {
      const result = await updateTestSubject(id, editForm);
      if (result.success) {
        setEditingId(null);
        router.refresh();
      } else {
        setError(result.error || "Failed to update subject");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setLoading(id);
    setError(null);

    try {
      const result = await updateTestSubject(id, { is_active: !currentStatus });
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
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nature of Questions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Display Order
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
            {testSubjects.map((ts) => (
              <tr key={ts.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {ts.subject_name || "Unknown Subject"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {editingId === ts.id ? (
                    <input
                      type="text"
                      value={editForm.nature_of_questions}
                      onChange={(e) =>
                        setEditForm({ ...editForm, nature_of_questions: e.target.value })
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="e.g., Multiple Choice"
                    />
                  ) : (
                    <span className="text-gray-600">
                      {ts.nature_of_questions || "-"}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingId === ts.id ? (
                    <input
                      type="number"
                      min="0"
                      value={editForm.display_order}
                      onChange={(e) =>
                        setEditForm({ ...editForm, display_order: parseInt(e.target.value) })
                      }
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    ts.display_order
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === ts.id ? (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editForm.is_active}
                        onChange={(e) =>
                          setEditForm({ ...editForm, is_active: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>
                  ) : (
                    <button
                      onClick={() => handleToggleActive(ts.id, ts.is_active)}
                      disabled={loading === ts.id}
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        ts.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      } ${loading === ts.id ? "opacity-50 cursor-not-allowed" : "hover:opacity-80 cursor-pointer"}`}
                    >
                      {ts.is_active ? "Active" : "Inactive"}
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {editingId === ts.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(ts.id)}
                          disabled={loading === ts.id}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(ts)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemove(ts.id, ts.subject_name || "this subject")}
                          disabled={loading === ts.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </>
                    )}
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
