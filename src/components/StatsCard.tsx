/* StatsCard — Key statistics display for event detail */

interface StatsCardProps {
  stats: { label: string; value: string }[];
}

export function StatsCard({ stats }: StatsCardProps) {
  return (
    <div className="p-6 rounded-xl bg-surface-container-low border border-outline-variant/10">
      <span className="font-label text-xs uppercase tracking-widest text-primary mb-6 block">
        Thống kê Kỷ niệm
      </span>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">
              {stat.label}
            </span>
            <span className="font-headline text-lg font-bold text-on-surface">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
