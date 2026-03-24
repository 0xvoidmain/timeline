/* EventCard — Glassmorphism vertical event card with image, badge, and engagement */

import { VerificationBadge } from "./VerificationBadge";
import { EngagementBar } from "./EngagementBar";

export interface EventCardData {
  id: string;
  image: string;
  date: string;
  title: string;
  description: string;
  likes: number;
  loves: number;
  sads?: number;
  comments: number;
  status: "verified" | "pending";
  aspectRatio?: string;
}

interface EventCardProps {
  event: EventCardData;
  className?: string;
  onClick?: () => void;
}

export function EventCard({ event, className = "", onClick }: EventCardProps) {
  const aspect = event.aspectRatio ?? "aspect-video";

  return (
    <div
      className={`glass-card rounded-xl overflow-hidden flex flex-col group border border-outline-variant/10 ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      {/* Image with gradient overlay + verification badge */}
      <div className={`relative ${aspect} overflow-hidden`}>
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent opacity-60" />
        <VerificationBadge status={event.status} />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Date label — Inter, uppercase, small */}
        <div className="flex items-center gap-3 mb-3">
          <span className="font-label text-[10px] uppercase tracking-widest text-primary-fixed-dim">
            {event.date}
          </span>
        </div>

        {/* Title — Noto Serif */}
        <h3 className="font-headline text-2xl mb-2 text-on-surface leading-snug">
          {event.title}
        </h3>

        {/* Description — Inter body */}
        <p className="text-on-surface-variant text-sm leading-relaxed mb-6 opacity-80">
          {event.description}
        </p>

        {/* Reactions + comments */}
        <EngagementBar
          likes={event.likes}
          loves={event.loves}
          sads={event.sads}
          comments={event.comments}
        />
      </div>
    </div>
  );
}
