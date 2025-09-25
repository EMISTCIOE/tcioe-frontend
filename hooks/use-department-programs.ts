import { useCallback, useEffect, useState } from "react";
import type {
  DepartmentProgramItem,
  DepartmentProgramsResponse,
  SearchableQueryParams,
} from "@/types";

interface UseDepartmentProgramsParams extends SearchableQueryParams {
  ordering?: string;
}

interface UseDepartmentProgramsReturn {
  programs: DepartmentProgramItem[];
  loading: boolean;
  error: string | null;
  pagination: { count: number; next: string | null; previous: string | null };
  refetch: () => void;
}

export function useDepartmentPrograms(
  slug: string,
  params: UseDepartmentProgramsParams = {}
): UseDepartmentProgramsReturn {
  const [programs, setPrograms] = useState<DepartmentProgramItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ count: 0, next: null as string | null, previous: null as string | null });

  const fetchPrograms = useCallback(async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      const search = new URLSearchParams();
      if (params.page) search.append("page", params.page.toString());
      if (params.limit) search.append("limit", params.limit.toString());
      if (params.search) search.append("search", params.search);
      if (params.ordering) search.append("ordering", params.ordering);

      const res = await fetch(`/api/departments/${encodeURIComponent(slug)}/programs?${search.toString()}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: DepartmentProgramsResponse = await res.json();
      setPrograms(data.results);
      setPagination({ count: data.count, next: data.next, previous: data.previous });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching department programs:", err);
    } finally {
      setLoading(false);
    }
  }, [slug, params.page, params.limit, params.search, params.ordering]);

  useEffect(() => { fetchPrograms(); }, [fetchPrograms]);
  const refetch = useCallback(() => { fetchPrograms(); }, [fetchPrograms]);

  return { programs, loading, error, pagination, refetch };
}

