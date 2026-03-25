/* Navbar — Fixed top navigation bar with logo, category links, search, and CTA */

import { useParams, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { SearchInput } from "./SearchInput";

const DEFAULT_YEAR = 2026;
const DEFAULT_CATEGORY = "all";

const CATEGORIES = [
  { label: "Tất cả", slug: "all" },
  { label: "Lịch sử", slug: "history" },
  { label: "Văn hóa", slug: "culture" },
  { label: "Âm nhạc", slug: "music" },
  { label: "Phim ảnh", slug: "cinema" },
  { label: "Xu hướng", slug: "trending" },
];

export function Navbar() {
  const { year: yearParam, category: categoryParam } = useParams();
  const navigate = useNavigate();
  const activeYear = Number(yearParam) || DEFAULT_YEAR;
  const activeCategory = categoryParam || DEFAULT_CATEGORY;

  const handleCategoryChange = useCallback(
    (slug: string) => {
      const search = window.location.search;
      navigate(`/${activeYear}/${slug}${search}`);
    },
    [navigate, activeYear],
  );

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md flex justify-between items-center px-8 py-4">
      {/* Logo */}
      <div className="font-headline text-2xl font-bold text-primary-container tracking-tight">
        Việt Nam
      </div>

      {/* Category navigation links */}
      <nav className="hidden md:flex items-center gap-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => handleCategoryChange(cat.slug)}
            className={
              cat.slug === activeCategory
                ? "font-label uppercase tracking-wider text-[12px] text-primary border-b-2 border-primary pb-1"
                : "font-label uppercase tracking-wider text-[12px] text-on-surface-variant/60 hover:text-primary transition-colors"
            }
          >
            {cat.label}
          </button>
        ))}
      </nav>

      {/* Search + CTA */}
      <div className="flex items-center gap-6">
        <SearchInput />
        <button className="bg-primary-container text-on-primary-container px-6 py-2 rounded-md font-label uppercase tracking-widest text-[10px] font-bold hover:brightness-110 active:scale-95 transition-all">
          Đóng góp ký ức
        </button>
      </div>
    </header>
  );
}
