import { useCallback, useEffect, useState } from "react";
import type { CampusEventGallery, PaginatedQueryParams } from "@/types";

interface UseDepartmentEventGalleryParams extends PaginatedQueryParams {}

interface UseDepartmentEventGalleryReturn {
  gallery: CampusEventGallery[];
  loading: boolean;
  error: string | null;
  pagination: { count: number; next: string | null; previous: string | null };
  refetch: () => void;
}

export function useDepartmentEventGallery(
  eventId: string | number,
  params: UseDepartmentEventGalleryParams = {}
): UseDepartmentEventGalleryReturn {
  const [gallery, setGallery] = useState<CampusEventGallery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ count: 0, next: null as string | null, previous: null as string | null });

  const fetchGallery = useCallback(async () => {
    if (!eventId && eventId !== 0) return;
    try {
      setLoading(true);
      setError(null);
      const search = new URLSearchParams();
      if (params.page) search.append("page", params.page.toString());
      if (params.limit) search.append("limit", params.limit.toString());

      const res = await fetch(`/api/departments/events/${encodeURIComponent(String(eventId))}/gallery?${search.toString()}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setGallery(data.results || []);
      setPagination({ count: data.count || 0, next: data.next || null, previous: data.previous || null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching department event gallery:", err);
    } finally {
      setLoading(false);
    }
  }, [eventId, params.page, params.limit]);

  useEffect(() => { fetchGallery(); }, [fetchGallery]);
  const refetch = useCallback(() => { fetchGallery(); }, [fetchGallery]);

  return { gallery, loading, error, pagination, refetch };
}

