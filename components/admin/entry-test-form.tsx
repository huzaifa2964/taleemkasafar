"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEntryTest, updateEntryTest } from "@/app/admin/entry-tests/actions";
import type { AdminEntryTest } from "@/lib/queries/admin-entry-tests";

type EntryTestFormProps = {
  entryTest?: AdminEntryTest;
  mode: "create" | "edit";
};

export function EntryTestForm({ entryTest, mode }: EntryTestFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    slug: entryTest?.slug || "",
    name: entryTest?.name || "",
    description: entryTest?.description || "",
    external_id: entryTest?.external_id || "",
    source: entryTest?.source || "",
    is_active: entryTest?.is_active ?? true,
    display_order: entryTest?.display_order || 0,
  });

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      // Only auto-generate slug if in create mode and slug is empty or matches previous auto-generated slug
      slug: mode === "create" && (!prev.slug || prev.slug === generateSlug(prev.name))
        ? generateSlug(name)
        : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = mode === "create"
        ? await createEntryTest(formData)
        : await updateEntryTest(entryTest!.id, formData);

      if (result.success) {
        router.push("/admin/entry-tests");
        router.refresh();
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="e.g., MDCAT, ECAT, NET"
        />
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
          Slug <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="slug"
          required
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="e.g., mdcat, ecat, net"
          pattern="[a-z0-9-]+"
        />
        <p className="mt-1 text-xs text-gray-500">
          URL-friendly identifier (lowercase letters, numbers, and hyphens only)
        </p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Brief description of the entry test"
        />
      </div>

      {/* External ID */}
      <div>
        <label htmlFor="external_id" className="block text-sm font-medium text-gray-700">
          External ID
        </label>
        <input
          type="text"
          id="external_id"
          value={formData.external_id}
          onChange={(e) => setFormData({ ...formData, external_id: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="External reference ID (optional)"
        />
      </div>

      {/* Source */}
      <div>
        <label htmlFor="source" className="block text-sm font-medium text-gray-700">
          Source
        </label>
        <input
          type="text"
          id="source"
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="e.g., PMC, UHS, NUMS"
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
        <p className="mt-1 text-xs text-gray-500">
          Lower numbers appear first in lists
        </p>
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
          Active (visible to users)
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Saving..." : mode === "create" ? "Create Entry Test" : "Update Entry Test"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
