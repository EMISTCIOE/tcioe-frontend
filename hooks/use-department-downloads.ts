import { useCallback, useEffect, useState } from "react";
import type { Download, DownloadsResponse, PaginatedQueryParams } from "@/types";
import env from "@/lib/env";
import { getMockDepartmentDownloads } from "@/data/mock-departments";

interface UseDepartmentDownloadsParams extends PaginatedQueryParams {}

interface UseDepartmentDownloadsReturn {
  downloads: Download[];
  loading: boolean;
  error: string | null;
  pagination: { count: number; next: string | null; previous: string | null };
  refetch: () => void;
}

export function useDepartmentDownloads(
  slug: string,
  params: UseDepartmentDownloadsParams = {}
): UseDepartmentDownloadsReturn {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ count: 0, next: null as string | null, previous: null as string | null });

  const fetchDownloads = useCallback(async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      if (env.USE_MOCK_DEPARTMENT) {
        const data: DownloadsResponse = getMockDepartmentDownloads(slug);
        setDownloads(params.limit ? data.results.slice(0, params.limit) : data.results);
        setPagination({ count: data.count, next: data.next, previous: data.previous });
        return;
      }
      const search = new URLSearchParams();
      if (params.page) search.append("page", params.page.toString());
      if (params.limit) search.append("limit", params.limit.toString());

      const res = await fetch(`/api/departments/${encodeURIComponent(slug)}/downloads?${search.toString()}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: DownloadsResponse = await res.json();
      setDownloads(data.results);
      setPagination({ count: data.count, next: data.next, previous: data.previous });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching department downloads:", err);
    } finally {
      setLoading(false);
    }
  }, [slug, params.page, params.limit]);

  useEffect(() => { fetchDownloads(); }, [fetchDownloads]);
  const refetch = useCallback(() => { fetchDownloads(); }, [fetchDownloads]);

  return { downloads, loading, error, pagination, refetch };
}
