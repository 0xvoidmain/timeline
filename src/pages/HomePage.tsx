/* HomePage — Archive page that loads events from the API, grouped by year */

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
  const [search, setSearch] = useState("");
  const [showContribute, setShowContribute] = useState(false);
  const pageRef = useRef(1);
  const sentinelRef = useRef<HTMLDivElement>(null);

  /* Load categories once */
  useEffect(() => {
    api
      .listCategories()
      .then((r) => setCategories(r.categories))
      .catch(() => {});
  }, []);

  /* Listen for search events from Navbar */
  useEffect(() => {
    const handler = (e: Event) => {
      const q = (e as CustomEvent<string>).detail ?? "";
      setSearch(q);
    };
    window.addEventListener("timeline:search", handler);
    return () => window.removeEventListener("timeline:search", handler);
  }, []);

  /* Listen for contribute events */
  useEffect(() => {
    const handler = () => setShowContribute(true);
    window.addEventListener("timeline:contribute", handler);
    return () => window.removeEventListener("timeline:contribute", handler);
  }, []);

  /* Fetch events when filters change */
  useEffect(() => {
    setLoading(true);
    pageRef.current = 1;
    setHasMore(true);

    const filters: Record<string, unknown> = {
      status: "verified",
      page: 1,
      limit: PAGE_SIZE,
    };
    if (categorySlug !== "all") filters.category = categorySlug;
    if (activeYear) filters.year = activeYear;
    if (search) filters.search = search;

    api
      .listEvents(filters as Parameters<typeof api.listEvents>[0])
      .then((res) => {
        setEvents(res.data);
        setHasMore(res.data.length >= PAGE_SIZE);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [activeYear, categorySlug, search]);

  /* Load more (infinite scroll) */
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = pageRef.current + 1;

    const filters: Record<string, unknown> = {
      status: "verified",
      page: nextPage,
      limit: PAGE_SIZE,
    };
    if (categorySlug !== "all") filters.category = categorySlug;
    if (activeYear) filters.year = activeYear;
    if (search) filters.search = search;

    api
      .listEvents(filters as Parameters<typeof api.listEvents>[0])
      .then((res) => {
        pageRef.current = nextPage;
        setEvents((prev) => [...prev, ...res.data]);
        setHasMore(res.data.length >= PAGE_SIZE);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }, [loadingMore, hasMore, categorySlug, activeYear, search]);

  /* Intersection observer for infinite scroll */
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "400px" },
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
          {/* Search indicator */}
          {search && (
            <div className="flex items-center gap-3 mt-8 mb-4">
              <span className="text-on-surface-variant text-sm">
                Kết quả cho &quot;{search}&quot;
              </span>
              <button
                onClick={() => {
                  setSearch("");
                  window.dispatchEvent(
                    new CustomEvent("timeline:search-clear"),
                  );
                }}
                className="text-primary text-xs font-label uppercase tracking-widest hover:underline"
              >
                Xóa
              </button>
            </div>
          )}

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
