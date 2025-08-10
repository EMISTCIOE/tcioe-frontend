import { useState, useEffect, useCallback } from "react";
import type {
  AcademicCalendar,
  AcademicCalendarsResponse,
  SearchableQueryParams,
} from "@/types";

interface UseAcademicCalendarsParams extends SearchableQueryParams {
  programType?: string;
  ordering?: string;
}

interface UseAcademicCalendarsReturn {
  calendars: AcademicCalendar[];
  loading: boolean;
  error: string | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  };
  refetch: () => void;
}

export function useAcademicCalendars(
  params: UseAcademicCalendarsParams = {}
): UseAcademicCalendarsReturn {
  const [calendars, setCalendars] = useState<AcademicCalendar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  });

  const fetchCalendars = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.search) searchParams.append("search", params.search);
      if (params.programType)
        searchParams.append("programType", params.programType);
      if (params.ordering) searchParams.append("ordering", params.ordering);

      const response = await fetch(
        `/api/academic-calendars?${searchParams.toString()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AcademicCalendarsResponse = await response.json();

      setCalendars(data.results);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching academic calendars:", err);
    } finally {
      setLoading(false);
    }
  }, [
    params.page,
    params.limit,
    params.search,
    params.programType,
    params.ordering,
  ]);

  useEffect(() => {
    fetchCalendars();
  }, [fetchCalendars]);

  const refetch = useCallback(() => {
    fetchCalendars();
  }, [fetchCalendars]);

  return {
    calendars,
    loading,
    error,
    pagination,
    refetch,
  };
}

// Helper function to format program type
export function formatProgramType(programType: string): string {
  const typeMap: Record<string, string> = {
    BACHELORS: "Bachelor's",
    MASTERS: "Master's",
    DIPLOMA: "Diploma",
    OTHER: "Other",
  };
  return typeMap[programType] || programType;
}

// Helper function to format academic year
export function formatAcademicYear(startYear: number, endYear: number): string {
  return `${startYear}/${endYear}`;
}
