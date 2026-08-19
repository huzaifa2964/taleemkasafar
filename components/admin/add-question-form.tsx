"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createQuestion, getTopicsBySubjectAction } from "@/app/admin/questions/actions";

type Subject = {
  id: string;
  name: string;
  slug: string;
};

type AddQuestionFormProps = {
  subjects: Subject[];
};

/**
 * Form for creating a new MCQ question.
 */
export function AddQuestionForm({ subjects }: AddQuestionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);

  // Form state
  const [subjectId, setSubjectId] = useState("");
  const [topics, setTopics] = useState<{ id: string; name: string }[]>([]);

  // Load topics when subject changes
  useEffect(() => {
    if (!subjectId) {
      setTopics([]);
      return;
    }

    setIsLoadingTopics(true);
    getTopicsBySubjectAction(subjectId)
      .then((data) => setTopics(data))
      .catch((err) => {
        console.error("Failed to load topics:", err);
        setTopics([]);
      })
      .finally(() => setIsLoadingTopics(false));
  }, [subjectId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createQuestion(formData);

    if (result.success) {
      startTransition(() => {
        router.push("/admin/questions");
        router.refresh();
      });
    } else {
      setError(result.error || "Failed to create question");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Question Statement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Statement <span className="text-red-500">*</span>
        </label>
        <textarea
          name="statement"
          required
          rows={4}
          placeholder="Enter the question statement..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isPending}
        />
      </div>

      {/* Subject and Topic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <select
            name="subject_id"
            required
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPending}
          >
            <option value="">Select a subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic/Chapter (Optional)
          </label>
          <select
            name="topic_id"
            disabled={!subjectId || isLoadingTopics || isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">
              {isLoadingTopics ? "Loading topics..." : "No specific topic"}
            </option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Difficulty and External ID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty <span className="text-red-500">*</span>
          </label>
          <select
            name="difficulty"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPending}
          >
            <option value="">Select difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            External ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="external_id"
            required
            placeholder="e.g., Q12345"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPending}
          />
          <p className="text-xs text-gray-500 mt-1">
            Unique identifier from your question bank
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Answer Options
        </h3>

        <div className="space-y-4">
          {["A", "B", "C", "D"].map((label) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Option {label} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name={`option_${label.toLowerCase()}`}
                required
                placeholder={`Enter option ${label}...`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isPending}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Correct Answer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correct Answer <span className="text-red-500">*</span>
        </label>
        <select
          name="correct_option"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isPending}
        >
          <option value="">Select the correct answer</option>
          <option value="A">Option A</option>
          <option value="B">Option B</option>
          <option value="C">Option C</option>
          <option value="D">Option D</option>
        </select>
      </div>

      {/* Explanation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Explanation (Optional)
        </label>
        <textarea
          name="explanation"
          rows={3}
          placeholder="Explain why the correct answer is right..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isPending}
        />
      </div>

      {/* Source */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Source (Optional)
        </label>
        <input
          type="text"
          name="source"
          placeholder="e.g., NET 2023, Past Paper"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isPending}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Creating..." : "Create Question"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
