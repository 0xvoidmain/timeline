/* EventDetailModal — Full-screen overlay modal for viewing event details */
/* Loads event data from API by ID, composes sub-components */

import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { TimelineEvent, Comment as TComment } from "../types";
import { EventDetailHeader } from "./EventDetailHeader";
import { StatsCard } from "./StatsCard";
import { ContentSection } from "./ContentSection";
import { ReactionBar } from "./ReactionBar";
import { CommentCard } from "./CommentCard";

interface EventDetailModalProps {
  eventId: string;
  onClose: () => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;
  return `${Math.floor(days / 30)} tháng trước`;
}

export function EventDetailModal({ eventId, onClose }: EventDetailModalProps) {
  const [event, setEvent] = useState<TimelineEvent | null>(null);
  const [comments, setComments] = useState<TComment[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /* Lock body scroll while modal is open */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  /* Fetch event + comments */
  useEffect(() => {
    setLoading(true);
    setError(false);

    api
      .getEvent(eventId)
      .then((res) => {
        setEvent(res.event);
        return api.listComments(res.event._id, 1, 10);
      })
      .then((res) => {
        setComments(res.comments);
        setTotalComments(res.total);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [eventId]);

  /* Loading state */
  if (loading) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  /* Not-found / error fallback */
  if (error || !event) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-surface-container-low rounded-2xl p-12 text-center">
          <p className="text-on-surface-variant text-lg">
            Không tìm thấy sự kiện
          </p>
          <button
            onClick={onClose}
            className="mt-6 text-primary font-label text-sm uppercase tracking-widest hover:text-primary-container transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  /* Build reaction data for ReactionBar */
  const reactions = event.reactionCounts.map((r) => ({
    icon:
      r.type === "like"
        ? "👍"
        : r.type === "love"
          ? "❤️"
          : r.type === "sad"
            ? "😢"
            : r.type === "wow"
              ? "😮"
              : "😂",
    count: r.count,
    color:
      r.type === "like"
        ? "blue"
        : r.type === "love"
          ? "red"
          : r.type === "sad"
            ? "purple"
            : "amber",
  }));

  /* Build stats */
  const stats = [
    { label: "Lượt xem", value: event.viewCount.toLocaleString() },
    { label: "Bình luận", value: event.commentCount.toLocaleString() },
    { label: "Phiên bản", value: `v${event.currentVersion}` },
  ];

  const remainingComments = totalComments - comments.length;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content container */}
      <div className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto scrollbar-line mt-[5vh] mx-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="sticky top-4 float-right mr-4 mt-4 z-10 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {/* Atmosphere blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Inner content */}
        <div className="relative px-6 md:px-12 py-12">
          {/* Header */}
          <EventDetailHeader
            category={event.category}
            date={new Date(event.date).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
            title={event.title}
            description={event.description}
            status={event.status === "verified" ? "verified" : "pending"}
            verifiedBy={event.approvedBy?.name}
          />

          {/* Hero image + Stats grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-8">
              {event.image ? (
                <div className="rounded-xl overflow-hidden aspect-video">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-xl aspect-video bg-surface-container-high" />
              )}
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
              <StatsCard stats={stats} />
              {/* Sources */}
              {event.sources.length > 0 && (
                <div className="p-6 rounded-xl bg-surface-container-low border border-outline-variant/10">
                  <span className="font-label text-xs uppercase tracking-widest text-primary mb-4 block">
                    Nguồn tham khảo
                  </span>
                  <div className="space-y-2">
                    {event.sources.map((s, i) => (
                      <a
                        key={i}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-secondary hover:underline truncate"
                      >
                        {s.title || s.url}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <ContentSection
            title="Chi tiết sự kiện"
            paragraphs={event.description.split("\n\n").filter(Boolean)}
          />

          {/* Engagement section */}
          <div className="border-t border-outline-variant/10 pt-12 mb-16">
            <span className="font-label text-xs uppercase tracking-widest text-primary mb-6 block">
              Phản ứng từ cộng đồng
            </span>
            {reactions.length > 0 && (
              <div className="mb-8">
                <ReactionBar reactions={reactions} />
              </div>
            )}

            {/* Comments */}
            {comments.length > 0 && (
              <div className="space-y-4 mb-8">
                {comments.map((c: TComment) => (
                  <CommentCard
                    key={c._id}
                    author={c.author.name}
                    avatar="primary"
                    timeAgo={timeAgo(c.createdAt)}
                    text={c.text}
                  />
                ))}
              </div>
            )}

            {/* Show more comments button */}
            {remainingComments > 0 && (
              <button className="w-full py-3 rounded-xl border border-dashed border-outline-variant/20 text-on-surface-variant font-label text-sm hover:border-primary/30 hover:text-primary transition-colors">
                Xem thêm {remainingComments.toLocaleString()} bình luận khác
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
