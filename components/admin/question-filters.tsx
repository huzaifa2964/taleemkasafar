"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type QuestionFiltersProps = {
  initialSubject: string;
  initialTopic: string;
  initialDifficulty: string;
  initialSearch: string;
};

/**
 * Filter controls for questions list.
 */
export function QuestionFilters({
  initialSubject,
  initialTopic,
  initialDifficulty,
  initialSearch,
}: QuestionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [subject, setSubject] = useState(initialSubject);
  const [topic, setTopic] = useState(initialTopic);
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [search, setSearch] = useState(initialSearch);

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (subject) params.set("subject", subject);
    if (topic) params.set("topic", topic);
    if (difficulty) params.set("difficulty", difficulty);
    if (search) params.set("search", search);

    startTransition(() => {
      router.push(`/admin/questions?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setSubject("");
    setTopic("");
    setDifficulty("");
    setSearch("");

    startTransition(() => {
      router.push("/admin/questions");
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Statement
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Subject Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Subjects</option>
            {/* TODO: Load subjects dynamically */}
          </select>
        </div>

        {/* Topic Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic/Chapter
          </label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={!subject}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">All Topics</option>
            {/* TODO: Load topics dynamically based on subject */}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={applyFilters}
          disabled={isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Applying..." : "Apply Filters"}
        </button>
        <button
          onClick={clearFilters}
          disabled={isPending}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
