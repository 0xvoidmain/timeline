/* CommentCard — Single user comment with avatar and timestamp */

interface CommentCardProps {
  author: string;
  avatar: "primary" | "secondary" | "tertiary";
  timeAgo: string;
  text: string;
}

export function CommentCard({
  author,
  avatar,
  timeAgo,
  text,
}: CommentCardProps) {
  return (
    <div className="glass-card p-6 rounded-xl border border-outline-variant/5">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
          <span className={`material-symbols-outlined text-lg text-${avatar}`}>
            person
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Author + time */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-label text-sm font-bold text-on-surface">
              {author}
            </span>
            <span className="font-label text-xs text-on-surface-variant">
              {timeAgo}
            </span>
          </div>

          {/* Comment text */}
          <p className="italic text-on-surface-variant text-sm leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
