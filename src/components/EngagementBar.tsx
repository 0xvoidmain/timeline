/* EngagementBar — Reaction buttons (like, love, sad) + comment count */
/* Monochrome by default, themed colors on hover */

interface EngagementBarProps {
  likes: number;
  loves: number;
  sads?: number;
  comments: number;
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

export function EngagementBar({
  likes,
  loves,
  sads,
  comments,
}: EngagementBarProps) {
  return (
    <div className="flex items-center justify-between pt-8">
      <div className="flex items-center gap-4">
        {/* Like → secondary (cyan) on hover */}
        <button className="flex items-center gap-1.5 text-on-surface-variant hover:text-secondary transition-colors">
          <span className="material-symbols-outlined text-lg">thumb_up</span>
          <span className="text-xs font-label">{formatCount(likes)}</span>
        </button>

        {/* Love → error (warm red) on hover */}
        <button className="flex items-center gap-1.5 text-on-surface-variant hover:text-error transition-colors">
          <span className="material-symbols-outlined text-lg">favorite</span>
          <span className="text-xs font-label">{formatCount(loves)}</span>
        </button>

        {/* Sad → tertiary (lavender) on hover */}
        {sads !== undefined && (
          <button className="flex items-center gap-1.5 text-on-surface-variant hover:text-tertiary transition-colors">
            <span className="material-symbols-outlined text-lg">
              sentiment_sad
            </span>
            <span className="text-xs font-label">{formatCount(sads)}</span>
          </button>
        )}
      </div>

      {/* Comment count */}
      <div className="flex items-center gap-1.5 text-on-surface-variant">
        <span className="material-symbols-outlined text-lg">chat_bubble</span>
        <span className="text-xs font-label">{formatCount(comments)}</span>
      </div>
    </div>
  );
}
