/* SearchInput — Rounded search field with icon, design-system styled */

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  placeholder = "Tìm kiếm ký ức...",
  className = "",
}: SearchInputProps) {
  return (
    <div className={`relative group ${className}`}>
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
        search
      </span>
      <input
        type="text"
        placeholder={placeholder}
        className="bg-surface-container border-none text-xs rounded-full py-2 pl-10 pr-4 w-48 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
      />
    </div>
  );
}
