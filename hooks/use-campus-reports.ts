import { useState, useEffect, useCallback } from "react";
import type {
  CampusReport,
  CampusReportsResponse,
  SearchableQueryParams,
} from "@/types";

interface UseCampusReportsParams extends SearchableQueryParams {
  ordering?: string;
  reportType?: "SELF_STUDY" | "ANNUAL" | "FINANCIAL" | "ACADEMIC" | "OTHER";
}

interface UseCampusReportsReturn {
  reports: CampusReport[];
  loading: boolean;
  error: string | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  };
  refetch: () => void;
}

export function useCampusReports(
  params: UseCampusReportsParams = {}
): UseCampusReportsReturn {
  const [reports, setReports] = useState<CampusReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  });

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.search) searchParams.append("search", params.search);
      if (params.ordering) searchParams.append("ordering", params.ordering);
      if (params.reportType)
        searchParams.append("reportType", params.reportType);

      const response = await fetch(
        `/api/campus-reports?${searchParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CampusReportsResponse = await response.json();

      setReports(data.results);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching campus reports:", err);
    } finally {
      setLoading(false);
    }
  }, [
    params.page,
    params.limit,
    params.search,
    params.ordering,
    params.reportType,
  ]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const refetch = useCallback(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    loading,
    error,
    pagination,
    refetch,
  };
}
