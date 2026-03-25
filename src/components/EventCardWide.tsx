/* EventCardWide — Horizontal glassmorphism card for featured/documentary content */
/* Image left (50%), content right (50%) with secondary action button */

import type { TimelineEvent } from "../types";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];
  const month = months[d.getMonth()];
  return `${day} ${month}, ${d.getFullYear()}`;
}

interface EventCardWideProps {
  event: TimelineEvent;
  className?: string;
  onClick?: () => void;
}

export function EventCardWide({
  event,
  className = "",
  onClick,
}: EventCardWideProps) {
  return (
    <div
      className={`glass-card rounded-xl overflow-hidden flex flex-col md:flex-row group border border-outline-variant/10 ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      {/* Image half */}
      <div className="relative md:w-1/2 aspect-video md:aspect-auto overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-surface-container-high" />
        )}
        <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors" />
      </div>

      {/* Content half */}
      <div className="p-8 md:w-1/2 flex flex-col justify-center">
        {/* Source label */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-label text-[10px] uppercase tracking-widest text-primary-fixed-dim">
            {formatDate(event.date)}
          </span>
        </div>

        {/* Title — larger for featured content */}
        <h3 className="font-headline text-3xl mb-4 text-on-surface leading-tight">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-on-surface-variant text-base leading-relaxed mb-8 opacity-80">
          {event.description}
        </p>

        {/* Actions: secondary button + share/bookmark */}
        <div className="flex items-center gap-6">
          <button className="bg-surface-container-high border border-primary/15 text-primary px-6 py-2 rounded-md font-label text-xs uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all">
            Xem tư liệu
          </button>
          <div className="flex items-center gap-4 text-on-surface-variant">
            <span className="material-symbols-outlined cursor-pointer hover:text-secondary transition-colors">
              share
            </span>
            <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">
              bookmark
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
