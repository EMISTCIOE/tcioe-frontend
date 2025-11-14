"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  CampusDivisionDetail,
  CampusDivisionListResponse,
  CampusDivisionSummary,
} from "@/types";

type DivisionKind = "sections" | "units";

interface UseCampusDivisionsOptions {
  limit?: number;
  ordering?: string;
}

interface UseCampusDivisionsReturn {
  items: CampusDivisionSummary[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseCampusDivisionDetailReturn {
  data: CampusDivisionDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const buildListUrl = (
  kind: DivisionKind,
  options?: UseCampusDivisionsOptions
) => {
  const params = new URLSearchParams();
  if (options?.limit) {
    params.append("limit", String(options.limit));
  }
  if (options?.ordering) {
    params.append("ordering", options.ordering);
  }
  const query = params.toString();
  return query ? `/api/${kind}?${query}` : `/api/${kind}`;
};

export function useCampusDivisions(
  kind: DivisionKind,
  options?: UseCampusDivisionsOptions
): UseCampusDivisionsReturn {
  const [items, setItems] = useState<CampusDivisionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(buildListUrl(kind, options));
      if (!response.ok) {
        throw new Error(`Failed to load campus ${kind}`);
      }
      const data: CampusDivisionListResponse = await response.json();
      setItems(data.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [kind, options?.limit, options?.ordering]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    items,
    loading,
    error,
    refetch: fetchData,
  };
}

export function useCampusDivisionDetail(
  kind: DivisionKind,
  slug?: string
): UseCampusDivisionDetailReturn {
  const [data, setData] = useState<CampusDivisionDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!slug) {
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setData(null);
      const response = await fetch(`/api/${kind}/${slug}`);
      if (!response.ok) {
        throw new Error(`Unable to load ${kind} details.`);
      }
      const payload: CampusDivisionDetail = await response.json();
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [kind, slug]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    data,
    loading,
    error,
    refetch: fetchDetail,
  };
}
