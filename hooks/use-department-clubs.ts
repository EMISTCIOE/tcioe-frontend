"use client";

import { useCallback, useEffect, useState } from "react";

interface Club {
  uuid: string;
  name: string;
  shortDescription?: string;
  thumbnail?: string;
  websiteUrl?: string;
}

interface UseDepartmentClubsReturn {
  clubs: Club[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDepartmentClubs(
  departmentUuid?: string
): UseDepartmentClubsReturn {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClubs = useCallback(async () => {
    if (!departmentUuid) {
      setClubs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/department-clubs?department=${departmentUuid}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch clubs (${response.status})`);
      }

      const data = await response.json();
      console.log("📦 Clubs data from API:", data);
      console.log("📦 First club:", data?.results?.[0]);
      setClubs(data?.results ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load department clubs"
      );
    } finally {
      setLoading(false);
    }
  }, [departmentUuid]);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  return { clubs, loading, error, refetch: fetchClubs };
}
