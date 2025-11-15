import { useCallback, useEffect, useState } from "react";
import type { DepartmentJournalItem } from "@/types";

interface UseDepartmentJournalsParams {
  limit?: number;
  ordering?: string;
}

interface UseDepartmentJournalsReturn {
  journals: DepartmentJournalItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDepartmentJournals(
  slug?: string,
  params: UseDepartmentJournalsParams = {}
): UseDepartmentJournalsReturn {
  const [journals, setJournals] = useState<DepartmentJournalItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJournals = useCallback(async () => {
    if (!slug) {
      setJournals([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const query = new URLSearchParams();
      query.append("department_slug", slug);
      query.append("limit", String(params.limit || 1));
      if (params.ordering) {
        query.append("ordering", params.ordering);
      }

      const response = await fetch(`/api/journal?${query.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setJournals(data?.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load journal articles");
    } finally {
      setLoading(false);
    }
  }, [slug, params.limit, params.ordering]);

  useEffect(() => {
    void fetchJournals();
  }, [fetchJournals]);

  const refetch = useCallback(() => {
    void fetchJournals();
  }, [fetchJournals]);

  return { journals, loading, error, refetch };
}
