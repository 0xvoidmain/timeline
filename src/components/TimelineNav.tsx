/* TimelineNav — iOS-style wheel picker for timeline year selection */

import { useState, useRef, useEffect, useCallback } from "react";

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
const ITEM_HEIGHT = 36;

interface TimelineNavProps {
  activeYear?: number;
  onYearClick?: (year: number) => void;
}

export function TimelineNav({
  activeYear: controlledYear,
  onYearClick,
}: TimelineNavProps) {
  const [internalYear, setInternalYear] = useState(2026);
  const activeYear = controlledYear ?? internalYear;

  /** scrollOffset represents the pixel offset: 0 = first item centered */
  const [scrollOffset, setScrollOffset] = useState(0);
  const offsetRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [wheelHeight, setWheelHeight] = useState(0);

  /* Derived from dynamic height */
  const halfWheel = wheelHeight / 2;
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

  const maxOffset = (YEAR_MARKERS.length - 1) * ITEM_HEIGHT;

  /** Clamp offset within bounds */
  const clamp = (v: number) => Math.max(0, Math.min(v, maxOffset));

  /** Snap to nearest item */
  const snapTo = useCallback(
    (offset: number) => {
      const idx = Math.round(clamp(offset) / ITEM_HEIGHT);
      const snapped = idx * ITEM_HEIGHT;
      offsetRef.current = snapped;
      setScrollOffset(snapped);
      const year = YEAR_MARKERS[idx];
      if (year !== undefined) {
        setInternalYear(year);
        onYearClick?.(year);
      }
    },
    [onYearClick, maxOffset],
  );

  /** Animate to a target offset with spring-like easing */
  const animateTo = useCallback(
    (target: number) => {
      cancelAnimationFrame(momentumFrame.current);
      const snappedTarget =
        Math.round(clamp(target) / ITEM_HEIGHT) * ITEM_HEIGHT;
      const animate = () => {
        const current = offsetRef.current;
        const diff = snappedTarget - current;
        if (Math.abs(diff) < 0.5) {
          snapTo(snappedTarget);
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

  /** Initialize to activeYear position */
  useEffect(() => {
    const idx = YEAR_MARKERS.indexOf(activeYear);
    if (idx >= 0) {
      const offset = idx * ITEM_HEIGHT;
      offsetRef.current = offset;
      setScrollOffset(offset);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      const dy = dragStartY.current - e.clientY;
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

      const v = velocity.current;
      if (Math.abs(v) > 0.3) {
        // Momentum: project where offset will land
        const deceleration = 0.997;
        const frames = Math.log(0.01 / Math.abs(v)) / Math.log(deceleration);
        const distance =
          (v * 16 * (1 - Math.pow(deceleration, frames))) / (1 - deceleration);
        animateTo(offsetRef.current + distance);
      } else {
        snapTo(offsetRef.current);
      }
    },
    [animateTo, snapTo],
  );

  /** Mouse wheel support */
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const newOffset = clamp(offsetRef.current + e.deltaY);
      offsetRef.current = newOffset;
      setScrollOffset(newOffset);
      // Debounce snap
      cancelAnimationFrame(momentumFrame.current);
      momentumFrame.current = requestAnimationFrame(() => {
        snapTo(newOffset);
      });
    },
    [snapTo, maxOffset],
  );

  /** Click a specific year */
  const handleClick = (year: number) => {
    if (isDragging.current) return;
    const idx = YEAR_MARKERS.indexOf(year);
    if (idx >= 0) animateTo(idx * ITEM_HEIGHT);
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-surface-container-low hidden md:flex flex-col z-40">
      {/* Vertical timeline line with gradient fade at both ends */}
      <div className="pointer-events-none absolute left-8 top-0 bottom-0 w-px z-30">
        <div className="w-full h-full timeline-line" />
      </div>

      {/* Active node dot on the timeline line */}
      <div
        className="pointer-events-none absolute z-30"
        style={{ left: "calc(2rem - 4px)", top: "calc(50% - 4px)" }}
      >
        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(233,193,118,0.6)]" />
      </div>

      {/* The wheel container — full height */}
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        className="relative flex-1 select-none touch-none cursor-grab active:cursor-grabbing overflow-hidden"
        style={{ perspective: "1000px" }}
      >
        {/* Top / bottom fade masks */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-surface-container-low via-surface-container-low/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-surface-container-low via-surface-container-low/80 to-transparent z-20" />

        {/* Center selection indicator */}
        {wheelHeight > 0 && (
          <div
            className="pointer-events-none absolute inset-x-6 z-10"
            style={{
              top: halfWheel - ITEM_HEIGHT / 2,
              height: ITEM_HEIGHT,
              borderTop: "1px solid rgba(233,193,118,0.3)",
              borderBottom: "1px solid rgba(233,193,118,0.3)",
            }}
          />
        )}

        {/* 3D barrel cylinder */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {YEAR_MARKERS.map((year, idx) => {
            const itemOffset = idx * ITEM_HEIGHT - scrollOffset;
            const angle = (itemOffset / ITEM_HEIGHT) * anglePerItem;

            // Skip items too far off the wheel
            if (Math.abs(angle) > 90) return null;

            const radians = (angle * Math.PI) / 180;
            const translateY = Math.sin(radians) * radius;
            const translateZ = Math.cos(radians) * radius - radius;
            const opacity = Math.cos(radians);
            const isActive = year === activeYear;

            return (
              <div
                key={year}
                onClick={() => handleClick(year)}
                className="absolute flex items-center cursor-pointer"
                style={{
                  height: ITEM_HEIGHT,
                  width: "100%",
                  paddingLeft: "2.5rem",
                  transform: `translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${-angle}deg)`,
                  opacity: Math.max(opacity, 0),
                  backfaceVisibility: "hidden",
                }}
              >
                <span
                  className="font-headline transition-all duration-300 ease-out"
                  style={{
                    fontSize: isActive ? "1.25rem" : "0.875rem",
                    fontWeight: isActive ? 700 : 400,
                    color: isActive
                      ? "var(--color-primary)"
                      : "var(--color-on-surface-variant)",
                    textShadow: isActive
                      ? "0 0 12px rgba(233,193,118,0.4)"
                      : "none",
                    transform: isActive ? "scale(1.1)" : "scale(1)",
                    transformOrigin: "left center",
                    letterSpacing: isActive ? "0.04em" : "0",
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
