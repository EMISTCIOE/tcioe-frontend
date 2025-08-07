import { useState, useEffect, useCallback } from "react";
import type { CampusEvent, ClubEvent, SearchableQueryParams } from "@/types";

export type EventType = "campus" | "club" | "all";
export type CampusEventType =
  | "CULTURAL"
  | "ACADEMIC"
  | "SPORTS"
  | "TECHNICAL"
  | "OTHER";

// Helper function to generate event URL-friendly slug from title and date
export function generateEventSlug(title: string, date?: string): string {
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  // Add date to slug if provided
  if (date) {
    const eventDate = new Date(date);
    const year = eventDate.getFullYear();
    const month = String(eventDate.getMonth() + 1).padStart(2, "0");
    const day = String(eventDate.getDate()).padStart(2, "0");
    slug = `${year}-${month}-${day}-${slug}`;
  }

  return slug;
}

interface UseEventsParams extends SearchableQueryParams {
  type?: EventType;
  eventType?: CampusEventType;
  ordering?: string;
}

interface UseEventsParams extends SearchableQueryParams {
  type?: EventType;
  eventType?: CampusEventType;
  ordering?: string;
}

type UnifiedEvent = (CampusEvent | ClubEvent) & {
  source: "campus" | "club";
};

interface UseEventsReturn {
  events: UnifiedEvent[];
  loading: boolean;
  error: string | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  };
  refetch: () => void;
}

export function useEvents(params: UseEventsParams = {}): UseEventsReturn {
  const [events, setEvents] = useState<UnifiedEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  });

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.search) searchParams.append("search", params.search);
      if (params.type) searchParams.append("type", params.type);
      if (params.eventType) searchParams.append("eventType", params.eventType);
      if (params.ordering) searchParams.append("ordering", params.ordering);

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

      setEvents(data.results);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  }, [
    params.page,
    params.limit,
    params.search,
    params.type,
    params.eventType,
    params.ordering,
  ]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const refetch = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    pagination,
    refetch,
  };
}

// Hook for getting a single event
interface UseEventParams {
  id: string;
  type: "campus" | "club";
}

interface UseEventReturn {
  event: (CampusEvent | ClubEvent) | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEvent(params: UseEventParams): UseEventReturn {
  const [event, setEvent] = useState<(CampusEvent | ClubEvent) | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if the id is a slug (not a UUID format)
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          params.id
        );

      if (!isUUID) {
        // It's a slug, we need to find the event first
        const eventsResponse = await fetch(
          `/api/events?type=${params.type}&limit=100`
        );
        if (!eventsResponse.ok) {
          throw new Error("Failed to fetch events list");
        }

        const eventsData = await eventsResponse.json();
        const targetEvent = eventsData.results.find(
          (event: CampusEvent | ClubEvent) => {
            // For campus events, use eventStartDate; for club events, use date
            const eventDate =
              (event as CampusEvent).eventStartDate ||
              (event as ClubEvent).date;
            return generateEventSlug(event.title, eventDate) === params.id;
          }
        );

        if (!targetEvent) {
          throw new Error("Event not found");
        }

        // Now fetch the full event details using UUID
        const response = await fetch(
          `/api/events/${targetEvent.uuid}?type=${params.type}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Event not found");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setEvent(data);
      } else {
        // Direct UUID lookup
        const response = await fetch(
          `/api/events/${params.id}?type=${params.type}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Event not found");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setEvent(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching event:", err);
    } finally {
      setLoading(false);
    }
  }, [params.id, params.type]);

  useEffect(() => {
    if (params.id && params.type) {
      fetchEvent();
    }
  }, [fetchEvent]);

  const refetch = useCallback(() => {
    fetchEvent();
  }, [fetchEvent]);

  return {
    event,
    loading,
    error,
    refetch,
  };
}

// Helper functions
export const isUpcomingEvent = (event: UnifiedEvent): boolean => {
  const eventDate = new Date(
    event.source === "campus"
      ? (event as CampusEvent).eventStartDate
      : (event as ClubEvent).date
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate >= today;
};

export const isPastEvent = (event: UnifiedEvent): boolean => {
  return !isUpcomingEvent(event);
};

export const getEventDate = (event: UnifiedEvent): string => {
  return event.source === "campus"
    ? (event as CampusEvent).eventStartDate
    : (event as ClubEvent).date;
};

export const getEventEndDate = (event: UnifiedEvent): string | null => {
  return event.source === "campus" ? (event as CampusEvent).eventEndDate : null;
};

export const formatEventDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatEventDateRange = (
  startDate: string,
  endDate?: string
): string => {
  const start = formatEventDate(startDate);
  if (!endDate || startDate === endDate) {
    return start;
  }
  const end = formatEventDate(endDate);
  return `${start} - ${end}`;
};
