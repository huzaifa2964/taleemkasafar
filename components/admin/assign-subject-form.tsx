"use client";

import { useState } from "react";
import { assignSubjectToTest } from "@/app/admin/entry-tests/actions";

type Subject = {
  id: string;
  name: string;
  slug: string;
};

type AssignSubjectFormProps = {
  entryTestId: string;
  availableSubjects: Subject[];
  onSuccess?: () => void;
};

export function AssignSubjectForm({
  entryTestId,
  availableSubjects,
  onSuccess,
}: AssignSubjectFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    subject_id: "",
    nature_of_questions: "",
    display_order: 0,
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await assignSubjectToTest(
        entryTestId,
        formData.subject_id,
        {
          nature_of_questions: formData.nature_of_questions || undefined,
          display_order: formData.display_order,
          is_active: formData.is_active,
        }
      );

      if (result.success) {
        setShowForm(false);
        setFormData({
          subject_id: "",
          nature_of_questions: "",
          display_order: 0,
          is_active: true,
        });
        onSuccess?.();
      } else {
        setError(result.error || "An error occurred");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
      >
        + Assign Subject
      </button>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Subject to Test</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject Selection */}
        <div>
          <label htmlFor="subject_id" className="block text-sm font-medium text-gray-700">
            Subject <span className="text-red-500">*</span>
          </label>
          <select
            id="subject_id"
            required
            value={formData.subject_id}
            onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select a subject</option>
            {availableSubjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* Nature of Questions */}
        <div>
          <label htmlFor="nature_of_questions" className="block text-sm font-medium text-gray-700">
            Nature of Questions
          </label>
          <input
            type="text"
            id="nature_of_questions"
            value={formData.nature_of_questions}
            onChange={(e) => setFormData({ ...formData, nature_of_questions: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g., Multiple Choice, Theory-based"
          />
        </div>

        {/* Display Order */}
        <div>
          <label htmlFor="display_order" className="block text-sm font-medium text-gray-700">
            Display Order
          </label>
          <input
            type="number"
            id="display_order"
            min="0"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Is Active */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
            Active
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {loading ? "Assigning..." : "Assign Subject"}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
