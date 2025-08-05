import { useState, useEffect, useCallback } from "react";
import type { CampusInfo } from "@/types";

interface UseCampusInfoReturn {
  campusInfo: CampusInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCampusInfo(): UseCampusInfoReturn {
  const [campusInfo, setCampusInfo] = useState<CampusInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampusInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/campus-info", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CampusInfo = await response.json();
      setCampusInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching campus info:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampusInfo();
  }, [fetchCampusInfo]);

  const refetch = useCallback(() => {
    fetchCampusInfo();
  }, [fetchCampusInfo]);

  return {
    campusInfo,
    loading,
    error,
    refetch,
  };
}
