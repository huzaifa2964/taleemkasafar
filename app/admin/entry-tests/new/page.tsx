import { EntryTestForm } from "@/components/admin/entry-test-form";
import Link from "next/link";

/**
 * Create new entry test page.
 */
export default function NewEntryTestPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/admin/entry-tests" className="hover:text-blue-600">
          Entry Tests
        </Link>
        <span>/</span>
        <span className="text-gray-900">New Entry Test</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Entry Test</h1>
        <p className="text-gray-600 mt-2">
          Add a new entry test to the system
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <EntryTestForm mode="create" />
      </div>
    </div>
  );
}
