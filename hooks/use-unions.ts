import { useState, useEffect, useCallback } from "react";
import type { Union, UnionsResponse, SearchableQueryParams } from "@/types";

interface UseUnionsParams extends SearchableQueryParams {
  ordering?: string;
}

interface UseUnionsReturn {
  unions: Union[];
  loading: boolean;
  error: string | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  };
  refetch: () => void;
}

export function useUnions(params: UseUnionsParams = {}): UseUnionsReturn {
  const [unions, setUnions] = useState<Union[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  });

  const fetchUnions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.search) searchParams.append("search", params.search);
      if (params.ordering) searchParams.append("ordering", params.ordering);

      const response = await fetch(`/api/unions?${searchParams.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UnionsResponse = await response.json();

      setUnions(data.results);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching unions:", err);
    } finally {
      setLoading(false);
    }
  }, [params.page, params.limit, params.search, params.ordering]);

  useEffect(() => {
    fetchUnions();
  }, [fetchUnions]);

  const refetch = useCallback(() => {
    fetchUnions();
  }, [fetchUnions]);

  return {
    unions,
    loading,
    error,
    pagination,
    refetch,
  };
}

// Hook for getting a single union
interface UseUnionParams {
  id: string; // Can be either UUID or slug
}

interface UseUnionReturn {
  union: Union | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useUnion(params: UseUnionParams): UseUnionReturn {
  const [union, setUnion] = useState<Union | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnion = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if the id is a slug (not a UUID format)
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          params.id
        );

      if (!isUUID) {
        // It's a slug, we need to find the union first
        const unionsResponse = await fetch("/api/unions?limit=100"); // Get unions to find the matching slug
        if (!unionsResponse.ok) {
          throw new Error("Failed to fetch unions list");
        }
        const unionsData: UnionsResponse = await unionsResponse.json();
        const targetUnion = unionsData.results.find(
          (union) => generateUnionSlug(union.name) === params.id
        );

        if (!targetUnion) {
          throw new Error("Union not found");
        }

        // Now fetch the full union details using UUID
        const response = await fetch(`/api/unions/${targetUnion.uuid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Union not found");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Union = await response.json();
        setUnion(data);
      } else {
        // Direct UUID lookup
        const response = await fetch(`/api/unions/${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Union not found");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Union = await response.json();
        setUnion(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching union:", err);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchUnion();
    }
  }, [fetchUnion]);

  const refetch = useCallback(() => {
    fetchUnion();
  }, [fetchUnion]);

  return {
    union,
    loading,
    error,
    refetch,
  };
}

// Helper function to generate union URL-friendly slug
export function generateUnionSlug(unionName: string): string {
  return unionName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}
