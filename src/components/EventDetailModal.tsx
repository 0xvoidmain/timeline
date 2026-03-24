/* EventDetailModal — Full-screen overlay modal for viewing event details */
/* Composes: EventDetailHeader, MediaPlayer, StatsCard, QuoteCard, ContentSection, ReactionBar, CommentCard */

import { useEffect } from "react";
import { DUMMY_EVENT_DETAILS } from "../data/dummyEventDetails";
import { EventDetailHeader } from "./EventDetailHeader";
import { MediaPlayer } from "./MediaPlayer";
import { StatsCard } from "./StatsCard";
import { QuoteCard } from "./QuoteCard";
import { ContentSection } from "./ContentSection";
import { ReactionBar } from "./ReactionBar";
import { CommentCard } from "./CommentCard";

interface EventDetailModalProps {
  eventId: string;
  onClose: () => void;
}

export function EventDetailModal({ eventId, onClose }: EventDetailModalProps) {
  /* Lock body scroll while modal is open */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const data = DUMMY_EVENT_DETAILS[eventId];

  /* Not-found fallback */
  if (!data) {
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

  const remainingComments = data.totalComments - data.comments.length;

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
            category={data.category}
            date={data.date}
            title={data.title}
            description={data.description}
            status={data.status}
            verifiedBy={data.verifiedBy}
          />

          {/* Media + Stats grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-8">
              <MediaPlayer
                image={data.image}
                title={data.mediaTitle}
                artist={data.mediaArtist}
                duration={data.mediaDuration}
                currentTime={data.mediaCurrentTime}
                progress={data.mediaProgress}
              />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
              <StatsCard stats={data.stats} />
              <QuoteCard
                quote={data.quote}
                attribution={data.quoteAttribution}
              />
            </div>
          </div>

          {/* Content */}
          <ContentSection
            title={data.contentTitle}
            paragraphs={data.contentParagraphs}
          />

          {/* Engagement section */}
          <div className="border-t border-outline-variant/10 pt-12 mb-16">
            <span className="font-label text-xs uppercase tracking-widest text-primary mb-6 block">
              Phản ứng từ cộng đồng
            </span>
            <div className="mb-8">
              <ReactionBar reactions={data.reactions} />
            </div>

            {/* Comments */}
            <div className="space-y-4 mb-8">
              {data.comments.map((c) => (
                <CommentCard
                  key={c.id}
                  author={c.author}
                  avatar={c.avatar}
                  timeAgo={c.timeAgo}
                  text={c.text}
                />
              ))}
            </div>

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
