/* TimelineNav — iOS-style wheel picker for timeline year selection */

import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DEFAULT_YEAR = 2026;
const DEFAULT_CATEGORY = "all";
const ITEM_HEIGHT = 44;

/** Generate year markers at varying density across history */
function generateYearMarkers(): number[] {
  const markers: number[] = [];
  for (let y = -800; y <= 0; y += 1) markers.push(y);
  for (let y = 200; y <= 1000; y += 1) markers.push(y);
  for (let y = 1100; y <= 1800; y += 1) markers.push(y);
  for (let y = 1825; y <= 1950; y += 1) markers.push(y);
  for (let y = 1960; y <= 2026; y += 1) markers.push(y);
  return markers.reverse();
}

function formatYear(year: number): string {
  if (year <= 0) return `${Math.abs(year)} BCE`;
  return `${year}`;
}

const YEAR_MARKERS = generateYearMarkers();

export function TimelineNav() {
  const { year: yearParam, category: categoryParam } = useParams();
  const navigate = useNavigate();
  const controlledYear = Number(yearParam) || DEFAULT_YEAR;
  const category = categoryParam || DEFAULT_CATEGORY;

  const [scrollOffset, setScrollOffset] = useState(0);
  const offsetRef = useRef(0);
  const hasMountAnimated = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [wheelHeight, setWheelHeight] = useState(0);

  /* Derived geometry */
  const radius = wheelHeight / 2;
  const visibleItems = Math.max(Math.floor(wheelHeight / ITEM_HEIGHT), 1);
  const anglePerItem = 360 / (visibleItems * 2);

  /* ── Drag state ── */
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartOffset = useRef(0);
  const lastDragY = useRef(0);
  const lastDragTime = useRef(0);
  const velocity = useRef(0);
  const momentumFrame = useRef(0);
  const dragMoved = useRef(false);

  const maxOffset = (YEAR_MARKERS.length - 1) * ITEM_HEIGHT;

  const clamp = (v: number) => Math.max(0, Math.min(v, maxOffset));

  /** Suppress onYearClick during external (controlled) updates */
  const isExternalUpdate = useRef(false);

  /** Snap to nearest item */
  const snapTo = useCallback(
    (offset: number) => {
      const idx = Math.round(clamp(offset) / ITEM_HEIGHT);
      const snapped = idx * ITEM_HEIGHT;
      offsetRef.current = snapped;
      setScrollOffset(snapped);
    },
    [maxOffset],
  );

  /** Animate to target offset with spring-like easing */
  const animateTo = useCallback(
    (target: number, silent = false) => {
      cancelAnimationFrame(momentumFrame.current);
      const snappedTarget =
        Math.round(clamp(target) / ITEM_HEIGHT) * ITEM_HEIGHT;
      const animate = () => {
        const current = offsetRef.current;
        const diff = snappedTarget - current;
        if (Math.abs(diff) < 0.5) {
          snapTo(snappedTarget);
          if (silent) isExternalUpdate.current = false;
          return;
        }
        const next = current + diff * 0.15;
        offsetRef.current = next;
        setScrollOffset(next);
        momentumFrame.current = requestAnimationFrame(animate);
      };
      animate();
    },
    [snapTo, maxOffset],
  );

  /** On mount, animate from default year (2026) to the route year */
  useEffect(() => {
    if (hasMountAnimated.current) return;
    hasMountAnimated.current = true;
    const idx = YEAR_MARKERS.indexOf(controlledYear);
    if (idx < 0 || controlledYear === DEFAULT_YEAR) return;
    const targetOffset = idx * ITEM_HEIGHT;
    const timer = setTimeout(() => {
      isExternalUpdate.current = true;
      animateTo(targetOffset, true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /** Sync wheel position when controlledYear changes externally */
  useEffect(() => {
    if (!hasMountAnimated.current) return;
    const idx = YEAR_MARKERS.indexOf(controlledYear);
    if (idx < 0) return;
    const targetOffset = idx * ITEM_HEIGHT;
    if (Math.abs(offsetRef.current - targetOffset) < ITEM_HEIGHT * 0.5) return;
    lastNavigatedYear.current = controlledYear;
    isExternalUpdate.current = true;
    animateTo(targetOffset, true);
  }, [controlledYear, animateTo]);

  /** Navigate when the center year changes (covers drag, wheel, and momentum) */
  const activeIdx = Math.round(clamp(scrollOffset) / ITEM_HEIGHT);
  const activeYear = YEAR_MARKERS[activeIdx];
  const lastNavigatedYear = useRef(controlledYear);

  useEffect(() => {
    if (isExternalUpdate.current) return;
    if (activeYear === undefined || activeYear === lastNavigatedYear.current)
      return;
    lastNavigatedYear.current = activeYear;
    const search = window.location.search;
    navigate(`/${activeYear}/${category}${search}`, { replace: true });
  }, [activeYear, navigate, category]);

  /** Measure container height and track resizes */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setWheelHeight(entry.contentRect.height);
    });
    ro.observe(el);
    setWheelHeight(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  /* ── Pointer handlers ── */

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    dragMoved.current = false;
    dragStartY.current = e.clientY;
    dragStartOffset.current = offsetRef.current;
    lastDragY.current = e.clientY;
    lastDragTime.current = Date.now();
    velocity.current = 0;
    cancelAnimationFrame(momentumFrame.current);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const dy = (dragStartY.current - e.clientY) * 0.35;
      if (Math.abs(dragStartY.current - e.clientY) > 3)
        dragMoved.current = true;
      const newOffset = clamp(dragStartOffset.current + dy);
      offsetRef.current = newOffset;
      setScrollOffset(newOffset);

      const now = Date.now();
      const dt = now - lastDragTime.current;
      if (dt > 0) {
        velocity.current = (lastDragY.current - e.clientY) / dt;
      }
      lastDragY.current = e.clientY;
      lastDragTime.current = now;
    },
    [maxOffset],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

      if (!dragMoved.current) {
        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const centerY = rect.top + rect.height / 2;
          const clickFromCenter = e.clientY - centerY;
          const r = radius || 1;
          const clamped = Math.max(-1, Math.min(1, clickFromCenter / r));
          const radians = Math.asin(clamped);
          const angleDeg = (radians * 180) / Math.PI;
          const currentCenterIdx = offsetRef.current / ITEM_HEIGHT;
          const targetIdx = Math.round(
            currentCenterIdx + angleDeg / anglePerItem,
          );
          const clampedIdx = Math.max(
            0,
            Math.min(YEAR_MARKERS.length - 1, targetIdx),
          );
          animateTo(clampedIdx * ITEM_HEIGHT);
        }
        return;
      }

      const v = velocity.current;
      if (Math.abs(v) > 0.3) {
        const deceleration = 0.997;
        const frames = Math.log(0.01 / Math.abs(v)) / Math.log(deceleration);
        const distance =
          (v * 16 * (1 - Math.pow(deceleration, frames))) / (1 - deceleration);
        animateTo(offsetRef.current + distance);
      } else {
        snapTo(offsetRef.current);
      }
    },
    [animateTo, snapTo, radius, anglePerItem],
  );

  /** Mouse wheel — attached as non-passive to allow preventDefault */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const newOffset = clamp(offsetRef.current + e.deltaY);
      offsetRef.current = newOffset;
      setScrollOffset(newOffset);
      cancelAnimationFrame(momentumFrame.current);
      momentumFrame.current = requestAnimationFrame(() => {
        snapTo(newOffset);
      });
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [snapTo, maxOffset]);

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-surface-container-low hidden md:flex flex-col z-40">
      {/* Vertical timeline line with gradient fade */}
      <div className="pointer-events-none absolute left-8 top-0 bottom-0 w-px z-30">
        <div className="w-full h-full timeline-line" />
      </div>

      {/* Active node dot */}
      <div
        className="pointer-events-none absolute z-30"
        style={{ left: "calc(2rem - 4px)", top: "calc(50% - 4px)" }}
      >
        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(233,193,118,0.6)]" />
      </div>

      {/* Wheel container */}
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative flex-1 select-none touch-none overflow-hidden"
        style={{
          perspective: "1000px",
          cursor: isDragging.current ? "grabbing" : "",
        }}
      >
        {/* Top / bottom fade masks */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-surface-container-low via-surface-container-low/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-surface-container-low via-surface-container-low/80 to-transparent z-20" />

        {/* 3D barrel cylinder */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {YEAR_MARKERS.map((year, idx) => {
            const itemOffset = idx * ITEM_HEIGHT - scrollOffset;
            const angle = (itemOffset / ITEM_HEIGHT) * anglePerItem;

            if (Math.abs(angle) > 90) return null;

            const radians = (angle * Math.PI) / 180;
            const translateY = Math.sin(radians) * radius;
            const translateZ = Math.cos(radians) * radius - radius;
            const opacity = Math.cos(radians);
            const proximity = Math.max(1 - Math.abs(angle) / 30, 0);

            return (
              <div
                key={year}
                className="absolute flex items-center"
                style={{
                  height: ITEM_HEIGHT,
                  width: "100%",
                  paddingLeft: "3.5rem",
                  transform: `translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${-angle}deg)`,
                  opacity: Math.max(opacity * (0.7 + proximity * 0.7), 0),
                  backfaceVisibility: "hidden",
                }}
              >
                <span
                  className="font-headline"
                  style={{
                    fontSize: `${0.875 + proximity * 0.5}rem`,
                    fontWeight: proximity > 0.5 ? 700 : 400,
                    color:
                      proximity > 0.9
                        ? `color-mix(in srgb, var(--color-primary) ${Math.round(proximity * 100)}%, var(--color-outline))`
                        : "var(--color-outline)",
                    textShadow:
                      proximity > 0.5
                        ? `0 0 ${Math.round(proximity * 12)}px rgba(233,193,118,${(proximity * 0.4).toFixed(2)})`
                        : "none",
                    transform: `scale(${1 + proximity * 0.15})`,
                    transformOrigin: "left center",
                    letterSpacing: `${proximity * 0.04}em`,
                  }}
                >
                  {formatYear(year)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
