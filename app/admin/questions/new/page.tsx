import { getAllSubjects } from "@/lib/queries/admin-questions";
import { AddQuestionForm } from "@/components/admin/add-question-form";

/**
 * Admin page for creating a new question.
 */
export default async function NewQuestionPage() {
  const subjects = await getAllSubjects();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Question</h1>
        <p className="text-gray-600 mt-2">Create a new MCQ question</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <AddQuestionForm subjects={subjects} />
      </div>
    </div>
  );
}
