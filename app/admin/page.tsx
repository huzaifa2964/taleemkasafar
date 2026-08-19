import {
  getDashboardStats,
  getRecentTestSubmissions,
  getUserActivityStats,
} from "@/lib/queries/admin";
import { StatsCard } from "@/components/admin/stats-card";
import { RecentSubmissionsTable } from "@/components/admin/recent-submissions-table";
import { ActivityChart } from "@/components/admin/activity-chart";
import { unstable_noStore as noStore } from "next/cache";

/**
 * Admin dashboard home page.
 * Shows real-time statistics and recent activity.
 */
export default async function AdminDashboardPage() {
  noStore(); // Opt out of caching for dynamic data
  
  // Fetch all dashboard data in parallel
  const [stats, recentSubmissions, activityStats] = await Promise.all([
    getDashboardStats(),
    getRecentTestSubmissions(10),
    getUserActivityStats(30),
  ]);

  // Debug: Log what we received
  console.log("Dashboard data:", { 
    hasStats: !!stats, 
    submissionsCount: recentSubmissions.length, 
    activityCount: activityStats.length 
  });

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Failed to load dashboard
          </h1>
          <p className="text-gray-600 mb-4">
            You may not have admin access, or there was an error loading the data.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 max-w-md mx-auto text-left">
            <p className="text-sm font-semibold mb-2">Troubleshooting:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ Check browser console for errors (F12)</li>
              <li>✓ Verify your email is in the admins table</li>
              <li>✓ Try signing out and back in</li>
              <li>✓ Check Supabase logs for RLS errors</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of platform statistics and user activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.total_users}
          subtitle={`+${stats.recent_signups_7days} in last 7 days`}
          icon="👥"
          trend="up"
        />
        <StatsCard
          title="Total Attempts"
          value={stats.total_attempts}
          subtitle={`${stats.active_users_today} active today`}
          icon="📝"
          trend="neutral"
        />
        <StatsCard
          title="Mock Tests"
          value={stats.total_mock_attempts}
          subtitle="Completed mock tests"
          icon="⏱️"
          trend="neutral"
        />
        <StatsCard
          title="Practice Sessions"
          value={stats.total_practice_attempts}
          subtitle="Practice & past papers"
          icon="📚"
          trend="neutral"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Questions"
          value={stats.total_questions}
          subtitle="In question bank"
          icon="❓"
          trend="neutral"
        />
        <StatsCard
          title="Published Blogs"
          value={stats.published_blogs}
          subtitle={`${stats.total_blogs} total blogs`}
          icon="✍️"
          trend="neutral"
        />
        <StatsCard
          title="Active Today"
          value={stats.active_users_today}
          subtitle="Users active today"
          icon="🔥"
          trend="up"
        />
      </div>

      {/* Activity Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          User Activity (Last 30 Days)
        </h2>
        <ActivityChart data={activityStats} />
      </div>

      {/* Recent Test Submissions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Recent Test Submissions
          </h2>
        </div>
        <RecentSubmissionsTable submissions={recentSubmissions} />
      </div>
    </div>
  );
}
