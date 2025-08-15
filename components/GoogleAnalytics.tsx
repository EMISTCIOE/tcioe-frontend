"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function GoogleAnalytics({
  GA_MEASUREMENT_ID,
}: {
  GA_MEASUREMENT_ID: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const url = pathname + searchParams.toString();

    window.gtag("config", GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);

  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  );
}

// Custom hook for tracking events
export function useGoogleAnalytics() {
  const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
  ) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  const trackPageView = (page_title: string, page_location: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", {
        page_title,
        page_location,
      });
    }
  };

  const trackDownload = (fileName: string, fileType: string) => {
    trackEvent("download", "file", `${fileName} (${fileType})`);
  };

  const trackOutboundLink = (url: string) => {
    trackEvent("click", "outbound_link", url);
  };

  const trackFormSubmission = (formName: string) => {
    trackEvent("submit", "form", formName);
  };

  const trackSearch = (searchTerm: string) => {
    trackEvent("search", "site_search", searchTerm);
  };

  return {
    trackEvent,
    trackPageView,
    trackDownload,
    trackOutboundLink,
    trackFormSubmission,
    trackSearch,
  };
}
