import { useCallback, useEffect, useState } from "react";
import type {
  DepartmentsResponse,
  DepartmentListItem,
  SearchableQueryParams,
} from "@/types";
import env from "@/lib/env";
import { mockDepartmentsList } from "@/data/mock-departments";

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

      if (env.USE_MOCK_DEPARTMENT) {
        // Simulate filter/search locally for preview mode
        let results = mockDepartmentsList.results;
        if (params.search) {
          const q = params.search.toLowerCase();
          results = results.filter((d) =>
            `${d.name} ${d.shortName} ${d.briefDescription}`
              .toLowerCase()
              .includes(q)
          );
        }
        setDepartments(results);
        setPagination({ count: results.length, next: null, previous: null });
        return;
      }

      const search = new URLSearchParams();
      if (params.page) search.append("page", params.page.toString());
      if (params.limit) search.append("limit", params.limit.toString());
      if (params.offset !== undefined)
        search.append("offset", params.offset.toString());
      if (params.search) search.append("search", params.search);
      if (params.ordering) search.append("ordering", params.ordering);

      const res = await fetch(`/api/departments?${search.toString()}`);
      if (!res.ok) {
        // Don't throw error, return empty results
        setDepartments([]);
        setPagination({ count: 0, next: null, previous: null });
        return;
      }

      const data: DepartmentsResponse = await res.json();

      // Check if we got valid results
      if (!data || !Array.isArray(data.results)) {
        setDepartments([]);
        setPagination({ count: 0, next: null, previous: null });
        return;
      }

      setDepartments(data.results);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
    } catch (err) {
      // Don't show HTTP errors, just return empty state
      setDepartments([]);
      setPagination({ count: 0, next: null, previous: null });
      console.error("Error fetching departments:", err);
    } finally {
      setLoading(false);
    }
  }, [
    params.page,
    params.limit,
    params.offset,
    params.search,
    params.ordering,
  ]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const refetch = useCallback(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return { departments, loading, error, pagination, refetch };
}
