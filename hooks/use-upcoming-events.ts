import { useState, useEffect } from "react";
import type { CampusEvent, ClubEvent } from "@/types";

type UnifiedEvent = (CampusEvent | ClubEvent) & {
  source: "campus" | "club";
  displayDate: string;
  displayLocation?: string;
  displayDescription: string;
};

interface UseUpcomingEventsReturn {
  events: UnifiedEvent[];
  loading: boolean;
  error: string | null;
}

export function useUpcomingEvents(limit: number = 6): UseUpcomingEventsReturn {
  const [events, setEvents] = useState<UnifiedEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both campus and club events
        const searchParams = new URLSearchParams({
          type: "all",
          limit: limit.toString(),
          page: "1",
        });

        const response = await fetch(`/api/events?${searchParams.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Transform events to unified format
        const unifiedEvents: UnifiedEvent[] = data.results.map((event: any) => {
          const isCampusEvent = event.source === "campus";
          
          return {
            ...event,
            displayDate: isCampusEvent ? event.eventStartDate : event.date,
            displayLocation: isCampusEvent ? "Campus" : event.clubName,
            displayDescription: event.descriptionShort || event.descriptionDetailed || "",
          };
        });

        // Filter for upcoming events only
        const now = new Date();
        const upcomingEvents = unifiedEvents.filter(event => {
          const eventDate = new Date(event.displayDate);
          return eventDate >= now;
        });

        // Sort by date (soonest first)
        upcomingEvents.sort((a, b) => {
          const dateA = new Date(a.displayDate);
          const dateB = new Date(b.displayDate);
          return dateA.getTime() - dateB.getTime();
        });

        setEvents(upcomingEvents.slice(0, limit));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch events";
        setError(errorMessage);
        console.error("Error fetching upcoming events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, [limit]);

  return { events, loading, error };
}
