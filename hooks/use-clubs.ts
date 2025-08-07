import { useState, useEffect, useCallback } from "react";
import type { Club, ClubsResponse, SearchableQueryParams } from "@/types";

interface UseClubsParams extends SearchableQueryParams {
  ordering?: string;
}

interface UseClubsReturn {
  clubs: Club[];
  loading: boolean;
  error: string | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  };
  refetch: () => void;
}

export function useClubs(params: UseClubsParams = {}): UseClubsReturn {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  });

  const fetchClubs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.search) searchParams.append("search", params.search);
      if (params.ordering) searchParams.append("ordering", params.ordering);

      const response = await fetch(`/api/clubs?${searchParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ClubsResponse = await response.json();

      setClubs(data.results);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching clubs:", err);
    } finally {
      setLoading(false);
    }
  }, [params.page, params.limit, params.search, params.ordering]);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  const refetch = useCallback(() => {
    fetchClubs();
  }, [fetchClubs]);

  return {
    clubs,
    loading,
    error,
    pagination,
    refetch,
  };
}

// Hook for getting a single club
interface UseClubParams {
  id: string; // Can be either UUID or slug
}

interface UseClubReturn {
  club: Club | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Helper function to generate club URL-friendly slug
export function generateClubSlug(clubName: string): string {
  return clubName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Helper function to generate subdomain URL
export function generateClubSubdomain(clubName: string): string {
  const slug = generateClubSlug(clubName);
  return `${slug}.tcioe.edu.np`;
}

export function useClub(params: UseClubParams): UseClubReturn {
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClub = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if the id is a slug (not a UUID format)
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          params.id
        );

      if (!isUUID) {
        // It's a slug, we need to find the club first
        const clubsResponse = await fetch("/api/clubs?limit=100"); // Get clubs to find the matching slug
        if (!clubsResponse.ok) {
          throw new Error("Failed to fetch clubs list");
        }

        const clubsData: ClubsResponse = await clubsResponse.json();
        const targetClub = clubsData.results.find(
          (club) => generateClubSlug(club.name) === params.id
        );

        if (!targetClub) {
          throw new Error("Club not found");
        }

        // Now fetch the full club details using UUID
        const response = await fetch(`/api/clubs/${targetClub.uuid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Club not found");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Club = await response.json();
        setClub(data);
      } else {
        // Direct UUID lookup
        const response = await fetch(`/api/clubs/${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Club not found");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Club = await response.json();
        setClub(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching club:", err);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchClub();
    }
  }, [fetchClub]);

  const refetch = useCallback(() => {
    fetchClub();
  }, [fetchClub]);

  return {
    club,
    loading,
    error,
    refetch,
  };
}
