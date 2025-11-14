"use client";

import { useState, useCallback, useEffect } from "react";

interface ResearchFacilityDetailData {
  uuid: string;
  name: string;
  slug: string;
  short_description: string;
  detailed_description: string;
  objectives: string;
  thumbnail: string | null;
  display_order: number;
}

interface UseResearchFacilityDetailReturn {
  data: ResearchFacilityDetailData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useResearchFacilityDetail(
  slug: string
): UseResearchFacilityDetailReturn {
  const [data, setData] = useState<ResearchFacilityDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/research-facilities/${slug}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch research facility details: ${response.status}`
        );
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load research facility"
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Fetch on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
