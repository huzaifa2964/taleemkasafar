"use client";

import type { UserActivityStat } from "@/lib/queries/admin";

type ActivityChartProps = {
  data: UserActivityStat[];
};

/**
 * Simple bar chart showing user activity over time.
 * Displays signups, active users, and attempts.
 */
export function ActivityChart({ data }: ActivityChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No activity data</div>
    );
  }

  // Find max value for scaling
  const maxValue = Math.max(
    ...data.map((d) =>
      Math.max(d.new_signups, d.active_users, d.total_attempts)
    )
  );

  // Show only last 14 days for better visualization
  const recentData = data.slice(0, 14).reverse();

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex gap-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">New Signups</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Active Users</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span className="text-sm text-gray-600">Total Attempts</span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between gap-2 h-64">
        {recentData.map((stat, index) => {
          const date = new Date(stat.date);
          const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              {/* Bars */}
              <div className="w-full flex items-end justify-center gap-1 h-48">
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{
                    height: `${(stat.new_signups / maxValue) * 100}%`,
                    minHeight: stat.new_signups > 0 ? "4px" : "0",
                  }}
                  title={`Signups: ${stat.new_signups}`}
                />
                <div
                  className="w-full bg-green-500 rounded-t"
                  style={{
                    height: `${(stat.active_users / maxValue) * 100}%`,
                    minHeight: stat.active_users > 0 ? "4px" : "0",
                  }}
                  title={`Active Users: ${stat.active_users}`}
                />
                <div
                  className="w-full bg-purple-500 rounded-t"
                  style={{
                    height: `${(stat.total_attempts / maxValue) * 100}%`,
                    minHeight: stat.total_attempts > 0 ? "4px" : "0",
                  }}
                  title={`Attempts: ${stat.total_attempts}`}
                />
              </div>
              {/* Date label */}
              <span className="text-xs text-gray-500 transform -rotate-45 origin-top-left">
                {dateStr}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {data.reduce((sum, d) => sum + d.new_signups, 0)}
          </p>
          <p className="text-sm text-gray-600">Total Signups (30d)</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {Math.round(
              data.reduce((sum, d) => sum + d.active_users, 0) / data.length
            )}
          </p>
          <p className="text-sm text-gray-600">Avg Active Users/Day</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
            {data.reduce((sum, d) => sum + d.total_attempts, 0)}
          </p>
          <p className="text-sm text-gray-600">Total Attempts (30d)</p>
        </div>
      </div>
    </div>
  );
}
