/* HomePage — Virtual-scrolling archive page grouped by year (2026 → 2000) */

import { useSearchParams } from "react-router-dom";
import { useRef, useEffect, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { EventCard } from "../components/EventCard";
import { EventCardWide } from "../components/EventCardWide";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { EventDetailModal } from "../components/EventDetailModal";
import { FLATTENED_ROWS, YEAR_HEADER_INDICES } from "../data/dummyEvents";
import type { VirtualRow } from "../data/dummyEvents";

interface HomePageProps {
  activeYear: number;
  yearSource: "timeline" | "scroll";
  onYearChange: (year: number) => void;
}

/* Row height estimates for the virtualizer */
function estimateRowSize(index: number): number {
  const row = FLATTENED_ROWS[index];
  if (!row) return 100;
  switch (row.type) {
    case "year-header":
      return 120;
    case "event-row":
      return 480;
    case "featured":
      return 340;
  }
}

export function HomePage({
  activeYear,
  yearSource,
  onYearChange,
}: HomePageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeEventId = searchParams.get("event");

  const openEvent = (id: string) => setSearchParams({ event: id });
  const closeEvent = () => setSearchParams({});

  /* ── Scroll container ref ── */
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ── Virtualizer ── */
  const virtualizer = useVirtualizer({
    count: FLATTENED_ROWS.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: estimateRowSize,
    overscan: 3,
  });

  /* ── Track which year is visible as user scrolls ── */
  const lastReportedYear = useRef(activeYear);
  const isProgrammaticScroll = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const detectVisibleYear = useCallback(() => {
    if (isProgrammaticScroll.current) return;

    const items = virtualizer.getVirtualItems();
    // Find the first year-header that is at or near the top of the viewport
    // or the last year-header that is above the current scroll position
    let currentYear = lastReportedYear.current;
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const scrollTop = scrollEl.scrollTop;

    for (const item of items) {
      const row = FLATTENED_ROWS[item.index];
      if (row?.type === "year-header") {
        // If this header is within 200px of scroll top (generous threshold), it's the active year
        if (item.start <= scrollTop + 200) {
          currentYear = row.year;
        }
      }
    }

    if (currentYear !== lastReportedYear.current) {
      lastReportedYear.current = currentYear;
      onYearChange(currentYear);
    }
  }, [virtualizer, onYearChange]);

  /* Debounced scroll → year detection */
  const onScroll = useCallback(() => {
    if (isProgrammaticScroll.current) return;
    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(detectVisibleYear, 60);
  }, [detectVisibleYear]);

  /* ── Scroll-to-year when timeline sidebar is clicked ── */
  useEffect(() => {
    if (yearSource !== "timeline") return;
    const targetIdx = YEAR_HEADER_INDICES.get(activeYear);
    if (targetIdx === undefined) return;
    isProgrammaticScroll.current = true;
    lastReportedYear.current = activeYear;
    virtualizer.scrollToIndex(targetIdx, {
      align: "start",
      behavior: "smooth",
    });
    // Release lock after animation settles
    const timer = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 800);
    return () => clearTimeout(timer);
  }, [activeYear, yearSource, virtualizer]);

  /* ── Render a single virtual row ── */
  const renderRow = (row: VirtualRow, index: number) => {
    switch (row.type) {
      case "year-header":
        return (
          <header
            key={`yh-${row.year}`}
            className="mt-40 pt-20 pb-8 first:mt-0"
          >
            {/* Gradient separator line between year sections */}
            {index > 0 && (
              <div className="h-px mb-20 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            )}
            <div className="flex items-baseline gap-4">
              <h1 className="font-headline text-5xl font-bold text-on-surface m-0">
                {row.year}
              </h1>
              <span className="font-headline text-3xl font-normal text-on-surface/40 m-0">
                /
              </span>
              <span className="font-headline text-3xl font-normal text-primary m-0">
                {row.category}
              </span>
            </div>
            <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-2 block">
              The Archive / {row.categoryEn}
            </span>
          </header>
        );
      case "event-row":
        return (
          <div
            key={`er-${index}`}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start pb-8"
          >
            {row.events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => openEvent(event.id)}
              />
            ))}
          </div>
        );
      case "featured":
        return (
          <div key={`ft-${row.event.id}`} className="pb-8">
            <EventCardWide
              event={row.event}
              className="lg:col-span-2"
              onClick={() => openEvent(row.event.id)}
            />
          </div>
        );
    }
  };

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <>
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="ml-0 md:ml-56 pt-16 h-screen overflow-y-auto"
      >
        <div
          className="max-w-7xl mx-auto px-8 pb-12 relative"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualItems.map((virtualRow) => {
            const row = FLATTENED_ROWS[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className="absolute left-8 right-8"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {renderRow(row, virtualRow.index)}
              </div>
            );
          })}
        </div>

        <FloatingActionButton />
      </div>

      {/* Event detail modal — driven by ?event=ID search param */}
      {activeEventId && (
        <EventDetailModal eventId={activeEventId} onClose={closeEvent} />
      )}
    </>
  );
}
