"use client";

import { useCallback, useEffect, useState } from "react";
import type { GlobalEvent } from "@/types";

interface UseGlobalEventsParams {
  limit?: number;
  union?: string;
  club?: string;
  department?: string;
}

interface UseGlobalEventsResult {
  events: GlobalEvent[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGlobalEvents({
  limit = 6,
  union,
  club,
  department,
}: UseGlobalEventsParams): UseGlobalEventsResult {
  const [events, setEvents] = useState<GlobalEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append("limit", String(limit));
      if (union) params.append("union", union);
      if (club) params.append("club", club);
      if (department) params.append("department", department);

      const response = await fetch(`/api/global-events?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch global events (${response.status})`);
      }

      const data = await response.json();
      setEvents(data?.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [limit, union, club, department]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}
