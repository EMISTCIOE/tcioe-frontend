import { useState, useEffect, useCallback } from "react";
import type {
  CampusKeyOfficial,
  CampusKeyOfficialsResponse,
  SearchableQueryParams,
  StaffTitlePrefix,
} from "@/types";

interface UseCampusKeyOfficialsParams extends SearchableQueryParams {
  ordering?: string;
  designation?: string;
  isKeyOfficial?: boolean;
}

interface UseCampusKeyOfficialsReturn {
  officials: CampusKeyOfficial[];
  loading: boolean;
  error: string | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  };
  refetch: () => void;
}

/**
 * Fetches campus staff with support for pagination, search, and filtering.
 */
export function useCampusKeyOfficials(
  params: UseCampusKeyOfficialsParams = {}
): UseCampusKeyOfficialsReturn {
  const [officials, setOfficials] = useState<CampusKeyOfficial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  });

  const fetchOfficials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.search) searchParams.append("search", params.search);
      if (params.ordering)
        searchParams.append("ordering", params.ordering.toString());
      if (params.designation)
        searchParams.append("designation", params.designation);
      if (params.isKeyOfficial !== undefined) {
        searchParams.append(
          "is_key_official",
          params.isKeyOfficial ? "true" : "false"
        );
      }

      const queryString = searchParams.toString();
      const endpoint = queryString
        ? `/api/campus-key-officials?${queryString}`
        : "/api/campus-key-officials";

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CampusKeyOfficialsResponse = await response.json();

      setOfficials(data.results);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching campus staff:", err);
    } finally {
      setLoading(false);
    }
  }, [
    params.page,
    params.limit,
    params.search,
    params.ordering,
    params.designation,
    params.isKeyOfficial,
  ]);

  useEffect(() => {
    fetchOfficials();
  }, [fetchOfficials]);

  const refetch = useCallback(() => {
    fetchOfficials();
  }, [fetchOfficials]);

  return {
    officials,
    loading,
    error,
    pagination,
    refetch,
  };
}

const staffTitlePrefixLabels: Partial<Record<StaffTitlePrefix, string>> = {
  ER: "Er.",
  PROF: "Prof.",
  DR: "Dr.",
  MR: "Mr.",
  MRS: "Mrs.",
  MS: "Ms.",
  ASSOC_PROF: "Assoc. Prof.",
  ASST_PROF: "Asst. Prof.",
};

/**
 * Returns a human-readable label for a staff title prefix.
 */
export function formatStaffTitlePrefix(
  prefix?: StaffTitlePrefix | null
): string {
  if (!prefix) return "";
  const formatted = staffTitlePrefixLabels[prefix];
  if (formatted) {
    return formatted;
  }
  return prefix
    .split("_")
    .map((segment) => segment.charAt(0) + segment.slice(1).toLowerCase())
    .join(" ");
}
