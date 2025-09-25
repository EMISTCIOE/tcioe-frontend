import { useCallback, useEffect, useState } from "react";
import type { Download, DepartmentPlansResponse, PaginatedQueryParams } from "@/types";

interface UseDepartmentPlansParams extends PaginatedQueryParams {}

interface UseDepartmentPlansReturn {
  plans: Download[]; // same shape as downloads
  loading: boolean;
  error: string | null;
  pagination: { count: number; next: string | null; previous: string | null };
  refetch: () => void;
}

export function useDepartmentPlans(
  slug: string,
  params: UseDepartmentPlansParams = {}
): UseDepartmentPlansReturn {
  const [plans, setPlans] = useState<Download[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ count: 0, next: null as string | null, previous: null as string | null });

  const fetchPlans = useCallback(async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);

      const search = new URLSearchParams();
      if (params.page) search.append("page", params.page.toString());
      if (params.limit) search.append("limit", params.limit.toString());

      const res = await fetch(`/api/departments/${encodeURIComponent(slug)}/plans?${search.toString()}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: DepartmentPlansResponse = await res.json();
      setPlans(data.results);
      setPagination({ count: data.count, next: data.next, previous: data.previous });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching department plans:", err);
    } finally {
      setLoading(false);
    }
  }, [slug, params.page, params.limit]);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);
  const refetch = useCallback(() => { fetchPlans(); }, [fetchPlans]);

  return { plans, loading, error, pagination, refetch };
}

