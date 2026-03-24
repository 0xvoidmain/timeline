/* QuoteCard — Highlighted quote block with decorative quotation marks */

interface QuoteCardProps {
  quote: string;
  attribution: string;
}

export function QuoteCard({ quote, attribution }: QuoteCardProps) {
  return (
    <div className="p-6 rounded-xl bg-surface-container-high border border-primary/10 relative overflow-hidden">
      {/* Decorative quote icon */}
      <span className="material-symbols-outlined text-7xl text-primary opacity-10 absolute -top-2 -left-1 pointer-events-none">
        format_quote
      </span>

      <p className="font-headline italic text-lg text-primary-fixed leading-relaxed relative z-10 mb-3">
        {quote}
      </p>
      <span className="font-label text-xs text-on-surface-variant relative z-10">
        {attribution}
      </span>
    </div>
  );
}
