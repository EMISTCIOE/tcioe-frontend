import { useCallback, useEffect, useState } from "react";
import type { DepartmentEventItem, DepartmentEventsResponse, SearchableQueryParams } from "@/types";
import env from "@/lib/env";
import { getMockDepartmentEvents } from "@/data/mock-departments";

interface UseDepartmentEventsParams extends SearchableQueryParams {
  ordering?: string;
}

interface UseDepartmentEventsReturn {
  events: DepartmentEventItem[];
  loading: boolean;
  error: string | null;
  pagination: { count: number; next: string | null; previous: string | null };
  refetch: () => void;
}

export function useDepartmentEvents(
  slug: string,
  params: UseDepartmentEventsParams = {}
): UseDepartmentEventsReturn {
  const [events, setEvents] = useState<DepartmentEventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ count: 0, next: null as string | null, previous: null as string | null });

  const fetchEvents = useCallback(async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      if (env.USE_MOCK_DEPARTMENT) {
        const data: DepartmentEventsResponse = getMockDepartmentEvents(slug);
        setEvents(data.results);
        setPagination({ count: data.count, next: data.next, previous: data.previous });
        return;
      }
      const search = new URLSearchParams();
      if (params.page) search.append("page", params.page.toString());
      if (params.limit) search.append("limit", params.limit.toString());
      if (params.search) search.append("search", params.search);
      if (params.ordering) search.append("ordering", params.ordering);

      const res = await fetch(`/api/departments/${encodeURIComponent(slug)}/events?${search.toString()}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: DepartmentEventsResponse = await res.json();
      setEvents(data.results);
      setPagination({ count: data.count, next: data.next, previous: data.previous });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching department events:", err);
    } finally {
      setLoading(false);
    }
  }, [slug, params.page, params.limit, params.search, params.ordering]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);
  const refetch = useCallback(() => { fetchEvents(); }, [fetchEvents]);

  return { events, loading, error, pagination, refetch };
}
