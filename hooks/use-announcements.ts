import { useState, useEffect } from "react";
import { NoticesService } from "@/lib/api/notices";
import type { Notice } from "@/types";

/**
 * Hook for fetching latest announcements (notices) for homepage
 */
export function useAnnouncements(limit: number = 6) {
  const [announcements, setAnnouncements] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch latest notices ordered by creation date (newest first)
        const response = await NoticesService.getNotices({
          limit,
          ordering: "-created_at", // Order by newest first
        });

        setAnnouncements(response.results);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch announcements"
        );
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [limit]);

  return {
    announcements,
    loading,
    error,
  };
}
