import { useCallback, useEffect, useMemo, useState } from "react";

import { useNotices } from "@/hooks/use-notices";
import type { Notice } from "@/types";

const POPUP_STORAGE_PREFIX = "featured_notice_popup_";
const POPUP_FRESHNESS_DAYS = 7;

export function useFeaturedNoticePopup() {
  const {
    notices,
    loading,
    error,
  } = useNotices({
    limit: 1,
    ordering: "-published_at",
    is_featured: true,
  });

  const latestFeaturedNotice = notices?.[0] ?? null;

  const isNoticeFresh = useMemo(() => {
    if (!latestFeaturedNotice?.publishedAt) return false;

    const publishedDate = new Date(latestFeaturedNotice.publishedAt);
    const diffMs = Date.now() - publishedDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    return diffDays <= POPUP_FRESHNESS_DAYS;
  }, [latestFeaturedNotice?.publishedAt]);

  const storageKey = latestFeaturedNotice
    ? `${POPUP_STORAGE_PREFIX}${latestFeaturedNotice.uuid}`
    : null;

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!latestFeaturedNotice || !isNoticeFresh || !storageKey) {
      setIsOpen(false);
      return;
    }

    if (typeof window === "undefined") return;

    const dismissed = sessionStorage.getItem(storageKey);
    setIsOpen(!dismissed);
  }, [storageKey, latestFeaturedNotice, isNoticeFresh]);

  const dismiss = useCallback(() => {
    if (storageKey && typeof window !== "undefined") {
      sessionStorage.setItem(storageKey, "dismissed");
    }
    setIsOpen(false);
  }, [storageKey]);

  return {
    loading,
    error,
    notice: isNoticeFresh ? (latestFeaturedNotice as Notice | null) : null,
    isOpen,
    dismiss,
  };
}
