import { useEffect, useState } from "react";
import { api } from "../services/api";
import { EventCard } from "../components/EventCard";
import type { TimelineEvent } from "../types";

export function HomePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listEvents()
      .then((data) => setEvents(data.events))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          World Timeline
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore events from around the world, filtered by category and
          country.
        </p>
      </div>

      {loading && <p className="text-gray-500">Loading events...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && events.length === 0 && (
        <p className="text-gray-500">No events yet. Be the first to add one!</p>
      )}

      <div className="space-y-4">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </main>
  );
}
