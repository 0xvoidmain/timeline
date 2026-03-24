/* Navbar — Fixed top navigation bar with logo, category links, search, and CTA */

import { SearchInput } from "./SearchInput";

const NAV_LINKS = [
  { label: "Lịch sử", href: "#", active: false },
  { label: "Văn hóa", href: "#", active: false },
  { label: "Âm nhạc", href: "#", active: true },
  { label: "Phim ảnh", href: "#", active: false },
  { label: "Xu hướng", href: "#", active: false },
];

export function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md flex justify-between items-center px-8 py-4">
      {/* Logo */}
      <div className="font-headline text-2xl font-bold text-primary-container tracking-tight">
        Ký Ức Việt Nam
      </div>

      {/* Category navigation links */}
      <nav className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={
              link.active
                ? "font-label uppercase tracking-wider text-[12px] text-primary border-b-2 border-primary pb-1"
                : "font-label uppercase tracking-wider text-[12px] text-on-surface-variant/60 hover:text-primary transition-colors"
            }
          >
            {link.label}
          </a>
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
