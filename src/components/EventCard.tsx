/* EventCard — Glassmorphism vertical event card with image, badge, and engagement */

import { VerificationBadge } from "./VerificationBadge";
import { EngagementBar } from "./EngagementBar";
import type { TimelineEvent } from "../types";

function getReactionCount(event: TimelineEvent, type: string): number {
  return event.reactionCounts?.find((r) => r.type === type)?.count ?? 0;
}

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

interface EventCardProps {
  event: TimelineEvent;
  className?: string;
  onClick?: () => void;
}

export function EventCard({ event, className = "", onClick }: EventCardProps) {
  return (
    <div
      className={`glass-card rounded-xl overflow-hidden flex flex-col group border border-outline-variant/10 ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      {/* Image with gradient overlay + verification badge */}
      <div className="relative aspect-video overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-surface-container-high" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent opacity-60" />
        <VerificationBadge
          status={event.status === "verified" ? "verified" : "pending"}
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Date label — Inter, uppercase, small */}
        <div className="flex items-center gap-3 mb-3">
          <span className="font-label text-[10px] uppercase tracking-widest text-primary-fixed-dim">
            {formatDate(event.date)}
          </span>
        </div>

        {/* Title — Noto Serif */}
        <h3 className="font-headline text-2xl mb-2 text-on-surface leading-snug">
          {event.title}
        </h3>

        {/* Description — Inter body */}
        <p className="text-on-surface-variant text-sm leading-relaxed mb-6 opacity-80 line-clamp-3">
          {event.description}
        </p>

        {/* Reactions + comments */}
        <EngagementBar
          likes={getReactionCount(event, "like")}
          loves={getReactionCount(event, "love")}
          sads={getReactionCount(event, "sad") || undefined}
          comments={event.commentCount}
        />
      </div>
    </div>
  );
}
