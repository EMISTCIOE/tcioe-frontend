import { useCallback, useEffect, useState } from "react";
import type { DepartmentProjectItem } from "@/types";

interface UseDepartmentProjectsParams {
  limit?: number;
  ordering?: string;
}

interface UseDepartmentProjectsReturn {
  projects: DepartmentProjectItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDepartmentProjects(
  slug?: string,
  params: UseDepartmentProjectsParams = {}
): UseDepartmentProjectsReturn {
  const [projects, setProjects] = useState<DepartmentProjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!slug) {
      setProjects([]);
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

      const response = await fetch(`/api/projects?${query.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setProjects(data?.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [slug, params.limit, params.ordering]);

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  const refetch = useCallback(() => {
    void fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch };
}
