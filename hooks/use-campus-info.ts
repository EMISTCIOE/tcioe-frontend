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
        // Check if we got a specific HTTP error
        if (response.status === 404) {
          setError("Campus information not available");
        } else if (response.status >= 500) {
          setError("Unable to load campus information at this time");
        } else {
          setError("Failed to load campus information");
        }
        setCampusInfo(null);
        return;
      }

      const data: CampusInfo = await response.json();

      // Check if data is empty
      if (!data || Object.keys(data).length === 0) {
        setError("No campus information available");
        setCampusInfo(null);
        return;
      }

      setCampusInfo(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError("Unable to load campus information. Please try again later.");
      setCampusInfo(null);
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
