import { useCallback, useEffect, useState } from "react";
import type { DepartmentDetail } from "@/types";
import env from "@/lib/env";
import { getMockDepartmentDetail } from "@/data/mock-departments";
import { useDepartments } from "./use-departments";

interface UseDepartmentByCodeReturn {
  department: DepartmentDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Fetch department by code (shortName like "DOECE") or slug
 * First tries to match shortName, falls back to slug
 */
export function useDepartmentByCode(code?: string): UseDepartmentByCodeReturn {
  const [department, setDepartment] = useState<DepartmentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { departments } = useDepartments({ limit: 100 });

  const fetchDepartment = useCallback(async () => {
    if (!code) return;

    try {
      setLoading(true);
      setError(null);

      // Find department by matching shortName (case-insensitive)
      const normalizedCode = code.toLowerCase().trim();
      const matchedDept = departments.find(
        (d) => d.shortName?.toLowerCase().trim() === normalizedCode
      );

      if (!matchedDept) {
        // If no match by shortName, try using code as slug directly
        if (env.USE_MOCK_DEPARTMENT) {
          setDepartment(getMockDepartmentDetail(code));
          return;
        }

        const res = await fetch(`/api/departments/${encodeURIComponent(code)}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Department not found");
          throw new Error(`HTTP error ${res.status}`);
        }
        const data: DepartmentDetail = await res.json();
        setDepartment(data);
        return;
      }

      // Fetch full details using the matched slug
      if (env.USE_MOCK_DEPARTMENT) {
        setDepartment(getMockDepartmentDetail(matchedDept.slug));
        return;
      }

      const res = await fetch(
        `/api/departments/${encodeURIComponent(matchedDept.slug)}`
      );
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
  }, [code, departments]);

  useEffect(() => {
    if (departments.length > 0 || !code) {
      fetchDepartment();
    }
  }, [fetchDepartment, departments.length, code]);

  const refetch = useCallback(() => {
    fetchDepartment();
  }, [fetchDepartment]);

  return { department, loading, error, refetch };
}
