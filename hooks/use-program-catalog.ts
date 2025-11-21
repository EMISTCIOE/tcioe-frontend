import { useCallback, useEffect, useState } from "react";

import type { ProgramCatalogItem, ProgramCatalogResponse } from "@/types";

type ProgramType = "BACHELORS" | "MASTERS" | "DIPLOMA" | "OTHER";

interface UseProgramCatalogReturn {
  programs: ProgramCatalogItem[];
  loading: boolean;
  error: string | null;
  pagination: { count: number; next: string | null; previous: string | null };
  refetch: () => void;
}

export function useProgramCatalog(programType: ProgramType): UseProgramCatalogReturn {
  const [programs, setPrograms] = useState<ProgramCatalogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  });

  const fetchPrograms = useCallback(async () => {
    if (!programType) return;
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ programType });
      const url = `/api/programs?${params.toString()}`;
      const res = await fetch(url);

      let data: ProgramCatalogResponse | null = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error("Program catalog: failed to parse JSON", jsonErr);
      }

      console.log("Program catalog fetch", {
        url,
        status: res.status,
        ok: res.ok,
        data,
      });

      if (!res.ok) {
        throw new Error(`Failed to load programs (${res.status})`);
      }

      setPrograms(Array.isArray(data?.results) ? data.results : []);
      setPagination({
        count: data?.count || 0,
        next: data?.next || null,
        previous: data?.previous || null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load programs");
      setPrograms([]);
      setPagination({ count: 0, next: null, previous: null });
      console.error("Error fetching programs:", err);
    } finally {
      setLoading(false);
    }
  }, [programType]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const refetch = useCallback(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  return { programs, loading, error, pagination, refetch };
}
