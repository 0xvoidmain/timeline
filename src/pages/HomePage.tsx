/* HomePage — Archive page with multi-year infinite scroll, events grouped by year */

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../services/api";
import { EventCard } from "../components/EventCard";
import { EventCardWide } from "../components/EventCardWide";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { EventDetailModal } from "../components/EventDetailModal";
import { ContributeModal } from "../components/ContributeModal";
import type { TimelineEvent, Category } from "../types";

const DEFAULT_YEAR = 2026;
const DEFAULT_CATEGORY = "all";
const PAGE_SIZE = 30;
const YEAR_WINDOW = 2; // ± years around center for initial load
const YEAR_EXTEND = 2; // years to extend backwards per scroll batch

/** ISO date-range helpers */
function yearStart(y: number) {
  return `${y}-01-01T00:00:00.000Z`;
}
function yearEnd(y: number) {
  return `${y}-12-31T23:59:59.999Z`;
}

/** Group events by year descending, picking the highest-scored as featured */
function groupByYear(events: TimelineEvent[]) {
  const map = new Map<number, TimelineEvent[]>();
  for (const ev of events) {
    const y = new Date(ev.date).getFullYear();
    if (!map.has(y)) map.set(y, []);
    map.get(y)!.push(ev);
  }
  return [...map.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, evts]) => {
      evts.sort((a, b) => b.score - a.score);
      return { year, featured: evts[0], rest: evts.slice(1) };
    });
}

export function HomePage() {
  const {
    year: yearParam,
    category: categoryParam,
    slug: slugParam,
  } = useParams();
  const navigate = useNavigate();

  const activeYear = Number(yearParam) || DEFAULT_YEAR;
  const categorySlug = categoryParam || DEFAULT_CATEGORY;

  /* Data states */
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showContribute, setShowContribute] = useState(false);

  /* Pagination & range tracking */
  const pageRef = useRef(1);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const fromYearRef = useRef(activeYear - YEAR_WINDOW);
  const toYearRef = useRef(activeYear + YEAR_WINDOW);
  /** true when current from/to range has no more pages — next loadMore extends range */
  const rangeExhaustedRef = useRef(false);

  /* Load categories once */
  useEffect(() => {
    api
      .listCategories()
      .then((r) => setCategories(r.categories))
      .catch(() => {});
  }, []);

  /* Listen for contribute events */
  useEffect(() => {
    const handler = () => setShowContribute(true);
    window.addEventListener("timeline:contribute", handler);
    return () => window.removeEventListener("timeline:contribute", handler);
  }, []);

  /* Build filter object for current range */
  const buildFilters = useCallback(
    (page: number, from: number, to: number) => {
      const filters: Record<string, unknown> = {
        status: "verified",
        page,
        limit: PAGE_SIZE,
        from: yearStart(from),
        to: yearEnd(to),
      };
      if (categorySlug !== "all") filters.category = categorySlug;
      return filters as Parameters<typeof api.listEvents>[0];
    },
    [categorySlug],
  );

  /* Initial fetch — loads events for centerYear ± YEAR_WINDOW */
  useEffect(() => {
    const from = activeYear - YEAR_WINDOW;
    const to = activeYear + YEAR_WINDOW;
    fromYearRef.current = from;
    toYearRef.current = to;
    pageRef.current = 1;
    rangeExhaustedRef.current = false;
    setLoading(true);
    setHasMore(true);

    api
      .listEvents(buildFilters(1, from, to))
      .then((res) => {
        setEvents(res.data);
        if (res.data.length < PAGE_SIZE) {
          rangeExhaustedRef.current = true;
        }
        setHasMore(true); // can still extend range backwards
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [activeYear, categorySlug, buildFilters]);

  /* Load more — pages within current range, then extends range backwards */
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    if (!rangeExhaustedRef.current) {
      /* Still have pages in current range */
      const nextPage = pageRef.current + 1;
      api
        .listEvents(
          buildFilters(nextPage, fromYearRef.current, toYearRef.current),
        )
        .then((res) => {
          pageRef.current = nextPage;
          setEvents((prev) => [...prev, ...res.data]);
          if (res.data.length < PAGE_SIZE) {
            rangeExhaustedRef.current = true;
          }
        })
        .catch(() => {})
        .finally(() => setLoadingMore(false));
    } else {
      /* Current range exhausted — extend backwards */
      const oldFrom = fromYearRef.current;
      const newFrom = oldFrom - YEAR_EXTEND;
      const newTo = oldFrom - 1;

      if (newTo < 0) {
        // Reached year 0 — no more history to load
        setHasMore(false);
        setLoadingMore(false);
        return;
      }

      pageRef.current = 1;
      rangeExhaustedRef.current = false;
      fromYearRef.current = newFrom;

      api
        .listEvents(buildFilters(1, newFrom, newTo))
        .then((res) => {
          if (res.data.length === 0) {
            setHasMore(false);
          } else {
            setEvents((prev) => [...prev, ...res.data]);
            if (res.data.length < PAGE_SIZE) {
              rangeExhaustedRef.current = true;
            }
          }
        })
        .catch(() => {})
        .finally(() => setLoadingMore(false));
    }
  }, [loadingMore, hasMore, buildFilters]);

  /* Intersection observer for infinite scroll */
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "600px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  /* Category name helper */
  const getCategoryName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name ?? slug;

  /* Navigation helpers */
  const openEvent = (ev: TimelineEvent) => {
    const y = new Date(ev.date).getFullYear();
    navigate(`/${y}/${ev.category}/${ev.slug}`);
  };
  const closeEvent = () => navigate(`/${activeYear}/${categorySlug}`);

  const groups = groupByYear(events);

  return (
    <>
      <div className="ml-0 md:ml-56 pt-16 h-screen overflow-y-auto scrollbar-line">
        <div className="max-w-7xl mx-auto px-8 pb-12">
          {/* Loading spinner */}
          {loading && (
            <div className="flex justify-center items-center py-40">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Empty state */}
          {!loading && events.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40 text-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-6">
                search_off
              </span>
              <p className="text-on-surface-variant text-lg">
                Không tìm thấy sự kiện nào
              </p>
            </div>
          )}

          {/* Event groups by year */}
          {!loading &&
            groups.map((group, gi) => (
              <section key={group.year}>
                {/* Year header */}
                <header className={`${gi > 0 ? "mt-40" : "mt-12"} pt-20 pb-8`}>
                  {gi > 0 && (
                    <div className="h-px mb-20 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                  )}
                  <div className="flex items-baseline gap-4">
                    <h1 className="font-headline text-5xl font-bold text-on-surface m-0">
                      {group.year}
                    </h1>
                    <span className="font-headline text-3xl font-normal text-on-surface/40 m-0">
                      /
                    </span>
                    <span className="font-headline text-3xl font-normal text-primary m-0">
                      {getCategoryName(
                        categorySlug === "all"
                          ? group.featured.category
                          : categorySlug,
                      )}
                    </span>
                  </div>
                  <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-2 block">
                    The Archive / {group.year}
                  </span>
                </header>

                {/* Featured event */}
                <div className="pb-8">
                  <EventCardWide
                    event={group.featured}
                    className="lg:col-span-2"
                    onClick={() => openEvent(group.featured)}
                  />
                </div>

                {/* Rest of events in grid */}
                {group.rest.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start pb-8">
                    {group.rest.map((ev) => (
                      <EventCard
                        key={ev._id}
                        event={ev}
                        onClick={() => openEvent(ev)}
                      />
                    ))}
                  </div>
                )}
              </section>
            ))}

          {/* Load more sentinel */}
          <div ref={sentinelRef} className="h-1" />
          {loadingMore && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        <FloatingActionButton onContribute={() => setShowContribute(true)} />
      </div>

      {/* Event detail modal — driven by /:year/:category/:slug route */}
      {slugParam && (
        <EventDetailModal eventId={slugParam} onClose={closeEvent} />
      )}

      {/* Contribute memory modal */}
      {showContribute && (
        <ContributeModal onClose={() => setShowContribute(false)} />
      )}
    </>
  );
}
