import { useState, useEffect, useCallback } from "react";
import type { CampusEvent, ClubEvent, GlobalEvent } from "@/types";

type UnifiedEvent = (CampusEvent | ClubEvent | GlobalEvent) & {
  source: "campus" | "club" | "global";
  displayDate: string;
  displayLocation?: string;
  displayDescription: string;
};

interface UseUpcomingEventsReturn {
  events: UnifiedEvent[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const formatGlobalEventLocation = (event: GlobalEvent) => {
  const parts: string[] = [];
  if (event.unions?.length) {
    parts.push(event.unions.map((entry) => entry.name).join(", "));
  }
  if (event.clubs?.length) {
    parts.push(event.clubs.map((entry) => entry.name).join(", "));
  }
  if (event.departments?.length) {
    parts.push(event.departments.map((entry) => entry.name).join(", "));
  }
  return parts.length ? parts.join(" • ") : "College Event";
};

export function useUpcomingEvents(limit: number = 6): UseUpcomingEventsReturn {
  const [events, setEvents] = useState<UnifiedEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcomingEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const globalParams = new URLSearchParams({
        limit: limit.toString(),
      });
      const legacyParams = new URLSearchParams({
        type: "all",
        limit: limit.toString(),
        page: "1",
      });

      const [globalResponse, legacyResponse] = await Promise.all([
        fetch(`/api/global-events?${globalParams.toString()}`),
        fetch(`/api/events?${legacyParams.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }),
      ]);

      const globalData = globalResponse.ok ? await globalResponse.json() : { results: [] };
      const legacyData = legacyResponse.ok ? await legacyResponse.json() : { results: [] };

      const globalEvents: UnifiedEvent[] =
        (globalData.results ?? []).map((event: GlobalEvent) => ({
          ...event,
          source: "global",
          displayDate: event.eventStartDate,
          displayLocation: formatGlobalEventLocation(event),
          displayDescription: event.description || "",
        })) ?? [];

      const legacyEvents: UnifiedEvent[] =
        (legacyData.results ?? []).map((event: any) => {
          const isCampusEvent = event.source === "campus";
          return {
            ...event,
            source: event.source,
            displayDate: isCampusEvent ? event.eventStartDate : event.date,
            displayLocation: isCampusEvent ? "Campus" : event.clubName,
            displayDescription: event.descriptionShort || event.descriptionDetailed || "",
          };
        }) ?? [];

      const combined = [...globalEvents, ...legacyEvents];

      const now = new Date();
      const upcoming = combined.filter((event) => new Date(event.displayDate) >= now);

      upcoming.sort((a, b) => {
        const dateA = new Date(a.displayDate);
        const dateB = new Date(b.displayDate);
        return dateA.getTime() - dateB.getTime();
      });

      setEvents(upcoming.slice(0, limit));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch events";
      setError(errorMessage);
      console.error("Error fetching upcoming events:", err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchUpcomingEvents();
  }, [fetchUpcomingEvents]);

  const refetch = useCallback(() => {
    fetchUpcomingEvents();
  }, [fetchUpcomingEvents]);

  return { events, loading, error, refetch };
}
