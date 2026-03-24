/* TimelineNav — Vertical timeline year navigation with gold line and active node glow */

interface TimelineNavProps {
  years: number[];
  activeYear: number;
  onYearClick?: (year: number) => void;
}

export function TimelineNav({
  years,
  activeYear,
  onYearClick,
}: TimelineNavProps) {
  return (
    <div className="flex-grow relative px-4 flex">
      {/* Vertical gold line with gradient fade */}
      <div className="w-px h-full timeline-line absolute left-8" />

      <div className="flex flex-col justify-between w-full ml-12">
        {years.map((year) => {
          const isActive = year === activeYear;
          return (
            <button
              key={year}
              onClick={() => onYearClick?.(year)}
              className="relative flex items-center group cursor-pointer bg-transparent border-none p-0 text-left"
            >
              {/* Node dot */}
              {isActive ? (
                <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary shadow-[0_0_12px_rgba(233,193,118,0.5)] z-10" />
              ) : (
                <div className="absolute -left-[21px] w-2 h-2 rounded-full bg-surface-variant border border-primary/30 group-hover:bg-primary transition-colors" />
              )}

              {/* Year label */}
              <span
                className={
                  isActive
                    ? "font-headline text-lg font-bold text-primary"
                    : "font-headline text-sm text-on-surface-variant group-hover:text-primary transition-colors"
                }
              >
                {year}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
