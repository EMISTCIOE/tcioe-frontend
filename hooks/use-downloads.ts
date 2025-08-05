import { useState, useEffect, useCallback } from "react";
import type {
  Download,
  DownloadsResponse,
  SearchableQueryParams,
} from "@/types";

interface UseDownloadsParams extends SearchableQueryParams {
  ordering?: string;
}

interface UseDownloadsReturn {
  downloads: Download[];
  loading: boolean;
  error: string | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  };
  refetch: () => void;
}

export function useDownloads(
  params: UseDownloadsParams = {}
): UseDownloadsReturn {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  });

  const fetchDownloads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.search) searchParams.append("search", params.search);
      if (params.ordering) searchParams.append("ordering", params.ordering);

      const response = await fetch(
        `/api/downloads?${searchParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DownloadsResponse = await response.json();

      setDownloads(data.results);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching downloads:", err);
    } finally {
      setLoading(false);
    }
  }, [params.page, params.limit, params.search, params.ordering]);

  useEffect(() => {
    fetchDownloads();
  }, [fetchDownloads]);

  const refetch = useCallback(() => {
    fetchDownloads();
  }, [fetchDownloads]);

  return {
    downloads,
    loading,
    error,
    pagination,
    refetch,
  };
}
