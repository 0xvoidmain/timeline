/* VerificationBadge — Status pill overlay for event card images */
/* Variants: "verified" (cyan) and "pending" (dark with pulsing red dot) */

interface VerificationBadgeProps {
  status: "verified" | "pending";
}

export function VerificationBadge({ status }: VerificationBadgeProps) {
  if (status === "verified") {
    return (
      <div className="absolute top-4 right-4 bg-secondary-container/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 border border-secondary/20">
        <span
          className="material-symbols-outlined text-[14px] text-on-secondary-container"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          verified
        </span>
        <span className="text-[10px] font-label uppercase font-bold text-on-secondary-container">
          Verified
        </span>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 bg-surface-container/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
      <span className="text-[10px] font-label uppercase font-bold text-on-surface">
        Pending Verification
      </span>
    </div>
  );
}
