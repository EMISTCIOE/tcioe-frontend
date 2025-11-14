"use client";

import { useCallback, useEffect, useState } from "react";
import type { GlobalGalleryItem } from "@/types";

export function useGlobalGallery(limit = 18) {
  const [items, setItems] = useState<GlobalGalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ limit: String(limit) });
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
  }, [limit]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  return { items, loading, error, refetch: fetchGallery };
}
