/* FloatingActionButton — Fixed bottom-right FAB for creating new events */

interface FloatingActionButtonProps {
  onContribute?: () => void;
}

export function FloatingActionButton({
  onContribute,
}: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={onContribute}
        className="bg-primary text-on-primary w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      >
        <span
          className="material-symbols-outlined text-3xl"
          style={{ fontVariationSettings: "'FILL' 0, 'wght' 600" }}
        >
          add
        </span>
      </button>
    </div>
  );
}
