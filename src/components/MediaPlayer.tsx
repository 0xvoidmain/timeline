/* MediaPlayer — Mock audio/video player with album art, controls, and progress bar */

interface MediaPlayerProps {
  image: string;
  title: string;
  artist: string;
  duration: string;
  currentTime: string;
  progress: number;
}

export function MediaPlayer({
  image,
  title,
  artist,
  duration,
  currentTime,
  progress,
}: MediaPlayerProps) {
  return (
    <div className="glass-card rounded-xl overflow-hidden relative aspect-video">
      {/* Background image */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6">
        {/* Title & artist */}
        <h3 className="font-headline text-2xl font-bold text-white mb-1">
          {title}
        </h3>
        <span className="font-label text-sm text-primary-fixed-dim mb-6">
          {artist}
        </span>

        {/* Controls row */}
        <div className="flex items-center gap-4 mb-3">
          <button className="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:bg-primary-container transition-colors">
            <span className="material-symbols-outlined text-on-primary-container text-2xl">
              play_arrow
            </span>
          </button>
          <button className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-xl">skip_next</span>
          </button>
          <button className="text-on-surface-variant hover:text-on-surface transition-colors ml-auto">
            <span className="material-symbols-outlined text-xl">volume_up</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Time labels */}
        <div className="flex justify-between">
          <span className="font-label text-xs text-on-surface-variant">
            {currentTime}
          </span>
          <span className="font-label text-xs text-on-surface-variant">
            {duration}
          </span>
        </div>
      </div>
    </div>
  );
}
