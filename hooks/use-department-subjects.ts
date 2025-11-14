"use client";

import { useCallback, useEffect, useState } from "react";
import type { DepartmentSubjectItem } from "@/types";

interface DepartmentSubjectsReturn {
  subjects: DepartmentSubjectItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDepartmentSubjects(departmentSlug?: string, programSlug?: string): DepartmentSubjectsReturn {
  const [subjects, setSubjects] = useState<DepartmentSubjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = useCallback(async () => {
    if (!departmentSlug) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.append("department", departmentSlug);
      if (programSlug) {
        params.append("program", programSlug);
      }

      const response = await fetch(`/api/department-subjects?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setSubjects(data.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load subjects");
    } finally {
      setLoading(false);
    }
  }, [departmentSlug, programSlug]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const refetch = useCallback(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return { subjects, loading, error, refetch };
}
