import { getAllEntryTests } from "@/lib/queries/admin-entry-tests";
import { EntryTestsTable } from "@/components/admin/entry-tests-table";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

/**
 * Admin entry tests management page.
 * Lists all entry tests with their subject counts and management actions.
 */
export default async function AdminEntryTestsPage() {
  noStore(); // Opt out of caching for dynamic data

  const entryTests = await getAllEntryTests();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Entry Tests</h1>
          <p className="text-gray-600 mt-2">
            Manage entry tests, assign subjects, and configure mock blueprints
          </p>
        </div>
        <Link
          href="/admin/entry-tests/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + Add Entry Test
        </Link>
      </div>

      {/* Entry Tests Table */}
      <div className="bg-white rounded-lg shadow">
        {entryTests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="mb-4">No entry tests found.</p>
            <Link
              href="/admin/entry-tests/new"
              className="text-blue-600 hover:text-blue-700"
            >
              Create your first entry test
            </Link>
          </div>
        ) : (
          <EntryTestsTable entryTests={entryTests} />
        )}
      </div>
    </div>
  );
}
