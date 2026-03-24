/* EventDetailHeader — Modal header with category breadcrumb, date, verification badge, title, and description */

interface EventDetailHeaderProps {
  category: string;
  date: string;
  title: string;
  description: string;
  status: "verified" | "pending";
  verifiedBy?: string;
}

export function EventDetailHeader({
  category,
  date,
  title,
  description,
  status,
  verifiedBy,
}: EventDetailHeaderProps) {
  return (
    <div className="mb-12">
      {/* Breadcrumb row */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="font-label text-xs uppercase tracking-widest text-primary">
          {category}
        </span>
        <span className="w-1 h-1 rounded-full bg-on-surface-variant/40" />
        <span className="font-label text-sm text-on-surface-variant">
          {date}
        </span>
        {status === "verified" && verifiedBy && (
          <span className="inline-flex items-center gap-1.5 bg-secondary-fixed/10 px-3 py-1 rounded-full">
            <span
              className="material-symbols-outlined text-sm text-secondary-fixed"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span className="font-label text-xs text-secondary-fixed">
              {verifiedBy}
            </span>
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="font-headline text-4xl md:text-6xl font-bold text-on-surface leading-tight mb-6 max-w-4xl">
        {title}
      </h1>

      {/* Description */}
      <p className="font-body text-on-surface-variant text-lg leading-relaxed max-w-2xl opacity-80">
        {description}
      </p>
    </div>
  );
}
