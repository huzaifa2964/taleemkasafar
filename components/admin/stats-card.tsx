type StatsCardProps = {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  trend?: "up" | "down" | "neutral";
};

/**
 * Stat card component for displaying dashboard metrics.
 */
export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend = "neutral",
}: StatsCardProps) {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        {trend !== "neutral" && (
          <span className={`text-sm font-medium ${trendColors[trend]}`}>
            {trend === "up" ? "↑" : "↓"}
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-3xl font-bold text-gray-900 mt-2">
        {value.toLocaleString()}
      </p>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}
