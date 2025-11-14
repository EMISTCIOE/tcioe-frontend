import { useCallback, useEffect, useState } from "react";
import type {
  Download,
  DepartmentPlansResponse,
  PaginatedQueryParams,
} from "@/types";
import env from "@/lib/env";
import { getMockDepartmentPlans } from "@/data/mock-departments";

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
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  });

  const fetchPlans = useCallback(async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      if (env.USE_MOCK_DEPARTMENT) {
        const data: DepartmentPlansResponse = getMockDepartmentPlans(slug);
        setPlans(
          params.limit ? data.results.slice(0, params.limit) : data.results
        );
        setPagination({
          count: data.count,
          next: data.next,
          previous: data.previous,
        });
        return;
      }

      const search = new URLSearchParams();
      if (params.page) search.append("page", params.page.toString());
      if (params.limit) search.append("limit", params.limit.toString());

      const res = await fetch(
        `/api/departments/${encodeURIComponent(
          slug
        )}/plans?${search.toString()}`
      );
      if (!res.ok) {
        // Don't throw error, return empty results
        setPlans([]);
        setPagination({ count: 0, next: null, previous: null });
        return;
      }

      const data: DepartmentPlansResponse = await res.json();

      // Check if we got valid results
      if (!data || !Array.isArray(data.results)) {
        setPlans([]);
        setPagination({ count: 0, next: null, previous: null });
        return;
      }

      setPlans(data.results);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
    } catch (err) {
      // Don't show HTTP errors, just return empty state
      setPlans([]);
      setPagination({ count: 0, next: null, previous: null });
      console.error("Error fetching department plans:", err);
    } finally {
      setLoading(false);
    }
  }, [slug, params.page, params.limit]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);
  const refetch = useCallback(() => {
    fetchPlans();
  }, [fetchPlans]);

  return { plans, loading, error, pagination, refetch };
}
