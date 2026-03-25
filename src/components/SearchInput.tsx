/* SearchInput — Rounded search field with icon and debounced search callback */

import { useState, useEffect, useRef, useCallback } from "react";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

export function SearchInput({
  placeholder = "Tìm kiếm ký ức...",
  className = "",
  onSearch,
}: SearchInputProps) {
  const [value, setValue] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setValue(q);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch?.(q.trim());
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      clearTimeout(debounceRef.current);
      onSearch?.(value.trim());
    }
  };

  /* Listen for external clear event */
  const handleClear = useCallback(() => setValue(""), []);
  useEffect(() => {
    window.addEventListener("timeline:search-clear", handleClear);
    return () =>
      window.removeEventListener("timeline:search-clear", handleClear);
  }, [handleClear]);

  return (
    <div className={`relative group ${className}`}>
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
        search
      </span>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="bg-surface-container border-none text-xs rounded-full py-2 pl-10 pr-4 w-48 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
      />
    </div>
  );
}
