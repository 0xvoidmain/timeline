import type { TimelineEvent } from "../types";

interface EventCardProps {
  event: TimelineEvent;
}

export function EventCard({ event }: EventCardProps) {
  const date = new Date(event.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {event.title}
        </h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 whitespace-nowrap">
          {event.category}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
        {event.description}
      </p>
      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        <time>{date}</time>
        <span>·</span>
        <span>{event.country}</span>
        {event.visibility === "anonymous" && (
          <>
            <span>·</span>
            <span className="italic">Anonymous</span>
          </>
        )}
      </div>
      {event.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
