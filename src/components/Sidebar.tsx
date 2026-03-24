/* Sidebar — Fixed left navigation shell with timeline, zoom slider, and footer links */

import { TimelineNav } from "./TimelineNav";

const YEARS = [2024, 2020, 2010, 2005, 2000, 1995];
const ACTIVE_YEAR = 2010;

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low hidden md:flex flex-col py-20 px-4 z-40 border-r border-primary/10">
      {/* Era header */}
      <div className="mb-12 px-4">
        <h2 className="font-headline text-primary text-xl font-bold">
          Niên Đại
        </h2>
        <p className="font-label font-semibold text-xs text-on-surface-variant opacity-60">
          1945 – 2024
        </p>
      </div>

      {/* Timeline year navigation */}
      <TimelineNav years={YEARS} activeYear={ACTIVE_YEAR} />

      {/* Zoom slider (visual only) */}
      <div className="mt-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <span className="font-label text-[10px] uppercase tracking-tighter text-on-surface-variant">
            Zoom
          </span>
          <span className="font-label text-[10px] text-primary">Phóng to</span>
        </div>
        <input
          type="range"
          className="w-full h-1 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      {/* Footer links */}
      <footer className="mt-12 flex flex-col gap-4 px-4">
        <div className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-all cursor-pointer">
          <span className="material-symbols-outlined text-xl">settings</span>
          <span className="font-label font-semibold text-xs">Cài đặt</span>
        </div>
        <div className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-all cursor-pointer">
          <span className="material-symbols-outlined text-xl">help</span>
          <span className="font-label font-semibold text-xs">Trợ giúp</span>
        </div>
      </footer>
    </aside>
  );
}
