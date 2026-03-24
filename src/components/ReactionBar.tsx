/* ReactionBar — Pill-shaped reaction buttons for event detail engagement section */

interface Reaction {
  icon: string;
  count: number;
  color: string;
}

interface ReactionBarProps {
  reactions: Reaction[];
}

function formatCount(n: number): string {
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

export function ReactionBar({ reactions }: ReactionBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {reactions.map((r) => (
        <button
          key={r.icon}
          className="flex items-center gap-2 bg-surface-container-highest rounded-full px-4 py-2 border border-transparent hover:border-outline-variant/15 transition-colors"
        >
          <span
            className={`material-symbols-outlined text-lg text-${r.color}`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {r.icon}
          </span>
          <span className="font-label text-xs text-on-surface-variant">
            {formatCount(r.count)}
          </span>
        </button>
      ))}
    </div>
  );
}
