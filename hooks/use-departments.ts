import { useCallback, useEffect, useState } from "react";
import type {
  DepartmentsResponse,
  DepartmentListItem,
  SearchableQueryParams,
} from "@/types";

interface UseDepartmentsParams extends SearchableQueryParams {
  ordering?: string;
  offset?: number; // optional explicit offset
}

interface UseDepartmentsReturn {
  departments: DepartmentListItem[];
  loading: boolean;
  error: string | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  };
  refetch: () => void;
}

export function useDepartments(
  params: UseDepartmentsParams = {}
): UseDepartmentsReturn {
  const [departments, setDepartments] = useState<DepartmentListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  });

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const search = new URLSearchParams();
      if (params.page) search.append("page", params.page.toString());
      if (params.limit) search.append("limit", params.limit.toString());
      if (params.offset !== undefined)
        search.append("offset", params.offset.toString());
      if (params.search) search.append("search", params.search);
      if (params.ordering) search.append("ordering", params.ordering);

      const res = await fetch(`/api/departments?${search.toString()}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const data: DepartmentsResponse = await res.json();
      setDepartments(data.results);
      setPagination({ count: data.count, next: data.next, previous: data.previous });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching departments:", err);
    } finally {
      setLoading(false);
    }
  }, [params.page, params.limit, params.offset, params.search, params.ordering]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const refetch = useCallback(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return { departments, loading, error, pagination, refetch };
}

