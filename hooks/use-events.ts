import { useState, useEffect, useCallback } from "react";
import type { CampusEvent, ClubEvent, SearchableQueryParams } from "@/types";

export type EventType = "campus" | "club" | "all";
export type CampusEventType =
  | "CULTURAL"
  | "ACADEMIC"
  | "SPORTS"
  | "TECHNICAL"
  | "OTHER";

// Helper function to generate event URL-friendly slug from title (no date)
export function generateEventSlug(title: string, date?: string): string {
  if (!title) return "";

  let slug = title
    .toLowerCase()
    .replace(/[&]/g, "and") // Replace & with "and"
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  // Ensure slug is not empty
  if (!slug) {
    slug = "event-" + Date.now();
  }

  return slug;
}

interface UseEventsParams extends SearchableQueryParams {
  type?: EventType;
  eventType?: CampusEventType;
  ordering?: string;
  club?: string;
  union?: string;
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
      if (params.club) searchParams.append("club", params.club);
      if (params.union) searchParams.append("union", params.union);

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
    params.club,
    params.union,
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

        let targetEvent = eventsData.results.find(
          (event: CampusEvent | ClubEvent) => {
            const eventSlug = generateEventSlug(event.title);
            return eventSlug === params.id;
          }
        );

        // If not found, try partial matching as fallback
        if (!targetEvent) {
          targetEvent = eventsData.results.find(
            (event: CampusEvent | ClubEvent) => {
              const eventSlug = generateEventSlug(event.title);
              return (
                eventSlug.includes(params.id) || params.id.includes(eventSlug)
              );
            }
          );
        }

        if (!targetEvent) {
          throw new Error(
            "Event not found - please check the event URL or try browsing from the events list"
          );
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
export const getEventDate = (event: UnifiedEvent): string => {
  // Prefer explicit eventDate if provided, then the global eventStartDate, finally legacy fields.
  return (
    (event as any).eventDate ||
    (event as any).eventStartDate ||
    (event.source === "campus"
      ? (event as CampusEvent).eventStartDate
      : (event as ClubEvent).date) ||
    ""
  );
};

export const isUpcomingEvent = (event: UnifiedEvent): boolean => {
  try {
    const dateString = getEventDate(event);
    if (!dateString) return false;

    const eventDate = new Date(dateString);

    // Check if date is valid
    if (isNaN(eventDate.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  } catch {
    return false;
  }
};

export const isRunningEvent = (event: UnifiedEvent): boolean => {
  try {
    const startDateString = getEventDate(event);
    const endDateString = getEventEndDate(event);

    if (!startDateString) return false;

    const startDate = new Date(startDateString);
    const today = new Date();

    // Set to start of day for date-only comparison
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);

    // If no end date, consider it running if it started today or before
    if (!endDateString) {
      return startDate <= today;
    }

    const endDate = new Date(endDateString);
    endDate.setHours(0, 0, 0, 0);

    // Event is running if today is between start and end date (inclusive)
    return startDate <= today && today <= endDate;
  } catch {
    return false;
  }
};

export const isPastEvent = (event: UnifiedEvent): boolean => {
  try {
    const startDateString = getEventDate(event);
    const endDateString = getEventEndDate(event);

    if (!startDateString) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If there's an end date, use that to determine if past
    if (endDateString) {
      const endDate = new Date(endDateString);
      endDate.setHours(0, 0, 0, 0);
      return endDate < today;
    }

    // If no end date, consider past if start date has passed
    const startDate = new Date(startDateString);
    startDate.setHours(0, 0, 0, 0);
    return startDate < today;
  } catch {
    return false;
  }
};

export const getEventStatus = (
  event: UnifiedEvent
): "upcoming" | "running" | "past" => {
  if (isRunningEvent(event)) return "running";
  if (isUpcomingEvent(event)) return "upcoming";
  return "past";
};

export const getEventStatusBadge = (
  status: "upcoming" | "running" | "past"
) => {
  switch (status) {
    case "upcoming":
      return "bg-blue-100 text-blue-800";
    case "running":
      return "bg-green-100 text-green-800";
    case "past":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export const getEventEndDate = (event: UnifiedEvent): string | null => {
  return event.source === "campus" ? (event as CampusEvent).eventEndDate : null;
};

export const formatEventDate = (
  dateString: string | null | undefined
): string => {
  if (!dateString) return "Date TBA";

  try {
    // Handle ISO string or other formats
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date format:", dateString);
      return "Date TBA";
    }

    // Format the date without time - always show just the date with day of week
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.warn("Error formatting date:", dateString, error);
    return "Date TBA";
  }
};

export const formatEventDateRange = (
  startDate: string | null | undefined,
  endDate?: string | null
): string => {
  if (!startDate) return "Date TBA";

  try {
    const start = formatEventDate(startDate);
    if (start === "Date TBA" || start === "Invalid Date") return start;

    if (!endDate || startDate === endDate) {
      return start;
    }

    const end = formatEventDate(endDate);
    if (end === "Date TBA" || end === "Invalid Date") return start;

    return `${start} - ${end}`;
  } catch {
    return "Date TBA";
  }
};
