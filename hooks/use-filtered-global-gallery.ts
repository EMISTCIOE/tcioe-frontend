"use client";

import { useCallback, useEffect, useState } from "react";
import type { GlobalGalleryItem } from "@/types";

interface UseFilteredGlobalGalleryParams {
  sourceType?: string;
  sourceIdentifier?: string;
  limit?: number;
}

interface UseFilteredGlobalGalleryResult {
  items: GlobalGalleryItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFilteredGlobalGallery({
  sourceType,
  sourceIdentifier,
  limit = 6,
}: UseFilteredGlobalGalleryParams): UseFilteredGlobalGalleryResult {
  const [items, setItems] = useState<GlobalGalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append("limit", String(limit));
      if (sourceType) params.append("source_type", sourceType);
      if (sourceIdentifier) params.append("source_identifier", sourceIdentifier);

      const response = await fetch(`/api/global-gallery?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch gallery (${response.status})`);
      }

      const data = await response.json();
      setItems(data?.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [limit, sourceType, sourceIdentifier]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  return { items, loading, error, refetch: fetchGallery };
}
