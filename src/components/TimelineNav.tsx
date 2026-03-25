/* TimelineNav — iOS-style wheel picker for timeline year selection */

import { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWheelPicker } from "../hooks/useWheelPicker";

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

  const controlledIndex = YEAR_MARKERS.indexOf(controlledYear);
  const defaultIndex = YEAR_MARKERS.indexOf(DEFAULT_YEAR);

  const onSelect = useCallback(
    (idx: number) => {
      const year = YEAR_MARKERS[idx];
      if (year !== undefined) {
        const search = window.location.search;
        navigate(`/${year}/${category}${search}`);
      }
    },
    [navigate, category],
  );

  const {
    containerRef,
    scrollOffset,
    radius,
    anglePerItem,
    isDragging,
    pointerHandlers,
  } = useWheelPicker({
    itemCount: YEAR_MARKERS.length,
    itemHeight: ITEM_HEIGHT,
    controlledIndex,
    defaultIndex,
    onSelect,
    mountAnimationDelay: 3000,
  });

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
        onPointerDown={pointerHandlers.onPointerDown}
        onPointerMove={pointerHandlers.onPointerMove}
        onPointerUp={pointerHandlers.onPointerUp}
        onPointerCancel={pointerHandlers.onPointerUp}
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
