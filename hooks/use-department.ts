import { useCallback, useEffect, useState } from "react";
import type { DepartmentDetail } from "@/types";
import env from "@/lib/env";
import { getMockDepartmentDetail } from "@/data/mock-departments";

interface UseDepartmentReturn {
  department: DepartmentDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDepartment(slug?: string): UseDepartmentReturn {
  const [department, setDepartment] = useState<DepartmentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartment = useCallback(async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      if (env.USE_MOCK_DEPARTMENT) {
        setDepartment(getMockDepartmentDetail(slug));
        return;
      }
      const res = await fetch(`/api/departments/${encodeURIComponent(slug)}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Department not found");
        throw new Error(`HTTP error ${res.status}`);
      }
      const data: DepartmentDetail = await res.json();
      setDepartment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching department:", err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchDepartment();
  }, [fetchDepartment]);

  const refetch = useCallback(() => {
    fetchDepartment();
  }, [fetchDepartment]);

  return { department, loading, error, refetch };
}
