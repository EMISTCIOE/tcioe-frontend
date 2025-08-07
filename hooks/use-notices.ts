import { useState, useEffect, useCallback, useMemo } from "react";
import { NoticesService, type NoticesQueryParams } from "@/lib/api/notices";
import type {
  Notice,
  NoticesResponse,
  NoticeCategory,
  NoticeDepartment,
} from "@/types";

/**
 * Hook for fetching notices with pagination and filtering
 */
export function useNotices(initialParams?: NoticesQueryParams) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  });

  // Memoize the serialized params to prevent unnecessary re-renders
  const serializedParams = useMemo(() => {
    // Filter out undefined/empty values to create stable params
    const cleanParams: Record<string, any> = {};
    if (initialParams) {
      Object.entries(initialParams).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && value !== null) {
          cleanParams[key] = value;
        }
      });
    }
    return JSON.stringify(cleanParams);
  }, [initialParams]);

  const fetchNotices = useCallback(async (params?: NoticesQueryParams) => {
    try {
      setLoading(true);
      setError(null);

      const response = await NoticesService.getNotices(params);

      setNotices(response.results);
      setPagination({
        count: response.count,
        next: response.next,
        previous: response.previous,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch notices");
      setNotices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = JSON.parse(serializedParams);
    fetchNotices(params);
  }, [fetchNotices, serializedParams]);

  const refetch = useCallback(
    (params?: NoticesQueryParams) => {
      return fetchNotices(params);
    },
    [fetchNotices]
  );

  return {
    notices,
    loading,
    error,
    pagination,
    refetch,
  };
}

/**
 * Hook for fetching a single notice by slug or UUID
 */
export function useNotice(identifier?: string) {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!identifier) {
      setLoading(false);
      return;
    }

    const fetchNotice = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await NoticesService.getNoticeBySlugOrId(identifier);
        setNotice(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch notice");
        setNotice(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [identifier]);

  const incrementViews = useCallback(async () => {
    if (!notice?.uuid) return;
    try {
      await NoticesService.incrementNoticeViews(notice.uuid);
    } catch (err) {
      console.error("Failed to increment views:", err);
    }
  }, [notice?.uuid]);

  const incrementShares = useCallback(async () => {
    if (!notice?.uuid) return;
    try {
      await NoticesService.incrementNoticeShares(notice.uuid);
    } catch (err) {
      console.error("Failed to increment shares:", err);
    }
  }, [notice?.uuid]);

  return {
    notice,
    loading,
    error,
    incrementViews,
    incrementShares,
  };
}

/**
 * Hook for fetching notice categories
 */
export function useNoticeCategories() {
  const [categories, setCategories] = useState<NoticeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await NoticesService.getNoticeCategories();
        setCategories(response.results);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch categories"
        );
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

/**
 * Hook for fetching notice departments
 */
export function useNoticeDepartments() {
  const [departments, setDepartments] = useState<NoticeDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await NoticesService.getNoticeDepartments();
        setDepartments(response.results);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch departments"
        );
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return { departments, loading, error };
}
