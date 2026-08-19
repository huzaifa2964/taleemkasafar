import { getAllQuestions } from "@/lib/queries/admin-questions";
import { QuestionsTable } from "@/components/admin/questions-table";
import { QuestionFilters } from "@/components/admin/question-filters";
import Link from "next/link";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

/**
 * Admin questions management page.
 * Displays all MCQ questions with filters and management options.
 */
export default async function AdminQuestionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const subjectId = typeof params.subject === "string" ? params.subject : "";
  const topicId = typeof params.topic === "string" ? params.topic : "";
  const difficulty =
    typeof params.difficulty === "string" ? params.difficulty : "";
  const search = typeof params.search === "string" ? params.search : "";
  const page = typeof params.page === "string" ? parseInt(params.page) : 1;

  const { questions, total, totalPages } = await getAllQuestions({
    subjectId,
    topicId,
    difficulty,
    search,
    page,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Questions Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage MCQ questions across all subjects and chapters
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Total Questions: <span className="font-bold">{total}</span>
          </div>
          <Link
            href="/admin/questions/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Add Question
          </Link>
        </div>
      </div>

      {/* Filters */}
      <QuestionFilters
        initialSubject={subjectId}
        initialTopic={topicId}
        initialDifficulty={difficulty}
        initialSearch={search}
      />

      {/* Questions Table */}
      <div className="bg-white rounded-lg shadow">
        <QuestionsTable
          questions={questions}
          currentPage={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
