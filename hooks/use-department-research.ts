import { useCallback, useEffect, useState } from "react";
import type { DepartmentResearchItem } from "@/types";

interface UseDepartmentResearchParams {
  limit?: number;
  ordering?: string;
}

interface UseDepartmentResearchReturn {
  research: DepartmentResearchItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDepartmentResearch(
  slug?: string,
  params: UseDepartmentResearchParams = {}
): UseDepartmentResearchReturn {
  const [research, setResearch] = useState<DepartmentResearchItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResearch = useCallback(async () => {
    if (!slug) {
      setResearch([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const query = new URLSearchParams();
      query.append("department_slug", slug);
      query.append("limit", String(params.limit || 3));
      if (params.ordering) {
        query.append("ordering", params.ordering);
      }

      const response = await fetch(`/api/research?${query.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setResearch(data?.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load research");
    } finally {
      setLoading(false);
    }
  }, [slug, params.limit, params.ordering]);

  useEffect(() => {
    void fetchResearch();
  }, [fetchResearch]);

  const refetch = useCallback(() => {
    void fetchResearch();
  }, [fetchResearch]);

  return { research, loading, error, refetch };
}
