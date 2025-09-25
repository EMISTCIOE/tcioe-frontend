import { useCallback, useEffect, useState } from "react";
import type {
  DepartmentStaffItem,
  DepartmentStaffsResponse,
  SearchableQueryParams,
} from "@/types";
import env from "@/lib/env";
import { getMockDepartmentStaffs } from "@/data/mock-departments";

interface UseDepartmentStaffsParams extends SearchableQueryParams {
  ordering?: string;
}

interface UseDepartmentStaffsReturn {
  staffs: DepartmentStaffItem[];
  loading: boolean;
  error: string | null;
  pagination: { count: number; next: string | null; previous: string | null };
  refetch: () => void;
}

export function useDepartmentStaffs(
  slug: string,
  params: UseDepartmentStaffsParams = {}
): UseDepartmentStaffsReturn {
  const [staffs, setStaffs] = useState<DepartmentStaffItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ count: 0, next: null as string | null, previous: null as string | null });

  const fetchStaffs = useCallback(async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      if (env.USE_MOCK_DEPARTMENT) {
        const data: DepartmentStaffsResponse = getMockDepartmentStaffs(slug);
        setStaffs(data.results.slice(0, params.limit || 6));
        setPagination({ count: data.count, next: data.next, previous: data.previous });
        return;
      }
      const search = new URLSearchParams();
      if (params.page) search.append("page", params.page.toString());
      if (params.limit) search.append("limit", params.limit.toString());
      if (params.search) search.append("search", params.search);
      if (params.ordering) search.append("ordering", params.ordering);

      const res = await fetch(`/api/departments/${encodeURIComponent(slug)}/staffs?${search.toString()}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: DepartmentStaffsResponse = await res.json();
      setStaffs(data.results);
      setPagination({ count: data.count, next: data.next, previous: data.previous });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching department staffs:", err);
    } finally {
      setLoading(false);
    }
  }, [slug, params.page, params.limit, params.search, params.ordering]);

  useEffect(() => { fetchStaffs(); }, [fetchStaffs]);
  const refetch = useCallback(() => { fetchStaffs(); }, [fetchStaffs]);

  return { staffs, loading, error, pagination, refetch };
}
