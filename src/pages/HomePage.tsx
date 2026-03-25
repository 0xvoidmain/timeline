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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fromYearRef = useRef(activeYear - YEAR_WINDOW);
  const toYearRef = useRef(activeYear + YEAR_WINDOW);
  /** true when current from/to range has no more pages — next loadMore extends range */
  const rangeExhaustedRef = useRef(false);
  /** Track the last category to detect category-only changes */
  const lastCategoryRef = useRef(categorySlug);
  /** Year section refs for scroll-to and IntersectionObserver */
  const yearSectionRefs = useRef<Map<number, HTMLElement>>(new Map());
  /** Suppress route updates while programmatically scrolling */
  const isProgrammaticScroll = useRef(false);
  /** Track the year currently visible in the viewport (from scroll) */
  const visibleYearRef = useRef(activeYear);
  /** Pending scroll-to year after data loads */
  const pendingScrollYear = useRef<number | null>(null);

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

  /** Scroll to a year section element smoothly, suppressing route updates */
  const scrollToYear = useCallback((year: number) => {
    const el = yearSectionRefs.current.get(year);
    if (!el || !scrollContainerRef.current) return;
    isProgrammaticScroll.current = true;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // Release the suppression after scroll settles
    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 800);
  }, []);

  /** Fetch events for a range and replace state */
  const fetchRange = useCallback(
    (from: number, to: number, scrollTarget?: number) => {
      fromYearRef.current = from;
      toYearRef.current = to;
      pageRef.current = 1;
      rangeExhaustedRef.current = false;
      setLoading(true);
      setHasMore(true);

      if (scrollTarget !== undefined) {
        pendingScrollYear.current = scrollTarget;
      }

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
    },
    [buildFilters],
  );

  /** Expand the loaded range to include a target year without discarding existing events */
  const expandRangeToInclude = useCallback(
    (targetYear: number) => {
      const currentFrom = fromYearRef.current;
      const currentTo = toYearRef.current;

      // Calculate new boundaries that include target ± YEAR_WINDOW
      const neededFrom = Math.min(currentFrom, targetYear - YEAR_WINDOW);
      const neededTo = Math.max(currentTo, targetYear + YEAR_WINDOW);

      // Determine which new range segment to fetch
      let fetchFrom: number;
      let fetchTo: number;
      if (targetYear < currentFrom) {
        // Need older data
        fetchFrom = neededFrom;
        fetchTo = currentFrom - 1;
      } else {
        // Need newer data
        fetchFrom = currentTo + 1;
        fetchTo = neededTo;
      }

      fromYearRef.current = neededFrom;
      toYearRef.current = neededTo;
      pendingScrollYear.current = targetYear;

      // Fetch just the missing segment and merge
      setLoadingMore(true);
      api
        .listEvents(buildFilters(1, fetchFrom, fetchTo))
        .then((res) => {
          if (res.data.length > 0) {
            setEvents((prev) => [...prev, ...res.data]);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingMore(false));
    },
    [buildFilters],
  );

  /* React to activeYear / categorySlug changes */
  useEffect(() => {
    const categoryChanged = lastCategoryRef.current !== categorySlug;
    lastCategoryRef.current = categorySlug;

    if (categoryChanged) {
      // Category changed — must reload from scratch
      fetchRange(
        activeYear - YEAR_WINDOW,
        activeYear + YEAR_WINDOW,
        activeYear,
      );
      return;
    }

    // Year is already within the loaded range — just scroll to it
    const inRange =
      activeYear >= fromYearRef.current && activeYear <= toYearRef.current;
    if (inRange && events.length > 0 && !loading) {
      const hasSection = yearSectionRefs.current.has(activeYear);
      if (hasSection) {
        scrollToYear(activeYear);
      }
      // Even if there's no section for this exact year (no events that year),
      // no need to refetch — the data is already loaded
      return;
    }

    // Year is outside the loaded range — expand or fresh-fetch
    if (events.length > 0 && !loading) {
      expandRangeToInclude(activeYear);
    } else {
      fetchRange(
        activeYear - YEAR_WINDOW,
        activeYear + YEAR_WINDOW,
        activeYear,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeYear, categorySlug]);

  /* After data loads and DOM updates, scroll to pending year */
  useEffect(() => {
    if (loading || pendingScrollYear.current === null) return;
    const target = pendingScrollYear.current;
    pendingScrollYear.current = null;
    // Wait for DOM to render the sections
    requestAnimationFrame(() => {
      scrollToYear(target);
    });
  }, [loading, events, scrollToYear]);

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

  /* Intersection observer for infinite scroll (sentinel) */
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

  /* IntersectionObserver on year sections — update route as user scrolls */
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || loading) return;

    const sections = yearSectionRefs.current;
    if (sections.size === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;
        // Find the topmost intersecting year section
        let topYear: number | null = null;
        let topBound = Infinity;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const year = Number(entry.target.getAttribute("data-year"));
            if (!isNaN(year) && entry.boundingClientRect.top < topBound) {
              topBound = entry.boundingClientRect.top;
              topYear = year;
            }
          }
        }
        if (topYear !== null && topYear !== visibleYearRef.current) {
          visibleYearRef.current = topYear;
          navigate(`/${topYear}/${categorySlug}`, { replace: true });
        }
      },
      {
        root: container,
        rootMargin: "-10% 0px -70% 0px",
        threshold: 0,
      },
    );

    for (const el of sections.values()) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, [loading, events, categorySlug, navigate]);

  /* Category name helper */
  const getCategoryName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name ?? slug;

  /* Navigation helpers */
  const openEvent = (ev: TimelineEvent) => {
    const y = new Date(ev.date).getFullYear();
    navigate(`/${y}/${ev.category}/${ev.slug}`);
  };
  const closeEvent = () => navigate(`/${activeYear}/${categorySlug}`);

  /** Register a year section ref */
  const setYearRef = useCallback(
    (year: number) => (el: HTMLElement | null) => {
      if (el) {
        yearSectionRefs.current.set(year, el);
      } else {
        yearSectionRefs.current.delete(year);
      }
    },
    [],
  );

  const groups = groupByYear(events);

  return (
    <>
      <div
        ref={scrollContainerRef}
        className="ml-0 md:ml-56 pt-16 h-screen overflow-y-auto scrollbar-line"
      >
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
              <section
                key={group.year}
                ref={setYearRef(group.year)}
                data-year={group.year}
              >
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
