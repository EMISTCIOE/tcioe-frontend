"use client";

import { useCallback, useEffect, useState } from "react";
import type { GlobalGalleryItem } from "@/types";

interface UseGlobalGalleryOptions {
  limit?: number;
  sourceType?: string;
  tags?: string;
}

export function useGlobalGallery(
  limitOrOptions?: number | UseGlobalGalleryOptions
) {
  // Support both old signature (number) and new signature (options object)
  const options: UseGlobalGalleryOptions =
    typeof limitOrOptions === "number"
      ? { limit: limitOrOptions }
      : limitOrOptions || {};

  const { limit = 18, sourceType, tags } = options;

  const [items, setItems] = useState<GlobalGalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ limit: String(limit) });

      if (sourceType) {
        params.append("source_type", sourceType);
      }
      if (tags) {
        params.append("tags", tags);
      }

      const response = await fetch(`/api/global-gallery?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch gallery (${response.status})`);
      }
      const data = await response.json();
      setItems(data?.results ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [limit, sourceType, tags]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  return { items, loading, error, refetch: fetchGallery };
}
