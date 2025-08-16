"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// PostHog types
interface PostHogConfig {
  api_host?: string;
  loaded?: (posthog: any) => void;
  capture_pageview?: boolean;
  capture_pageleave?: boolean;
  persistence?: "localStorage" | "cookie" | "memory";
  cookie_expiration?: number;
  cross_subdomain_cookie?: boolean;
  secure_cookie?: boolean;
  ip?: boolean;
  property_blacklist?: string[];
  bootstrap?: object;
  session_recording?: {
    maskAllInputs?: boolean;
    maskInputOptions?: object;
    recordCrossOriginIframes?: boolean;
  };
}

declare global {
  interface Window {
    posthog?: {
      init: (key: string, config?: PostHogConfig) => void;
      capture: (event: string, properties?: object) => void;
      identify: (userId: string, properties?: object) => void;
      reset: () => void;
      set: (properties: object) => void;
      register: (properties: object) => void;
      alias: (alias: string) => void;
      has_opted_out_capturing: () => boolean;
      opt_out_capturing: () => void;
      opt_in_capturing: () => void;
      isFeatureEnabled: (key: string) => boolean;
      getFeatureFlag: (key: string) => boolean | string;
      onFeatureFlags: (callback: (flags: string[]) => void) => void;
    };
  }
}

export function PostHogAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_POSTHOG_KEY ||
      !process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      console.warn("PostHog: Missing API key or host in environment variables");
      return;
    }

    // Use the official PostHog initialization method
    const initPostHog = () => {
      // Check if already initialized
      if (window.posthog && typeof window.posthog.init === "function") {
        console.log("PostHog: Already initialized");
        return;
      }

      // Create the PostHog script with the official snippet
      const script = document.createElement("script");
      script.innerHTML = `
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
      `;
      document.head.appendChild(script);

      // Initialize PostHog with the correct configuration
      if (window.posthog) {
        window.posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
          capture_pageview: true, // Enable automatic pageview tracking
          capture_pageleave: true,
          persistence: "localStorage",
          session_recording: {
            maskAllInputs: true,
            recordCrossOriginIframes: false,
          },
          property_blacklist: ["$password", "$email", "$phone"],
          loaded: (posthogInstance: any) => {
            console.log("PostHog: Successfully loaded and configured");

            // Set user properties for educational institution
            posthogInstance.register({
              institution: "Thapathali Campus",
              institution_type: "Engineering College",
              location: "Nepal",
              language: "en",
              environment: process.env.NODE_ENV || "production",
            });

            // Track initial load
            posthogInstance.capture("posthog_initialized", {
              timestamp: new Date().toISOString(),
              page: window.location.pathname,
            });

            // Enable feature flags
            if (typeof posthogInstance.onFeatureFlags === "function") {
              posthogInstance.onFeatureFlags(() => {
                console.log("PostHog: Feature flags loaded");
              });
            }
          },
        });
      }
    };

    initPostHog();

    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    // Wait a bit for PostHog to initialize, then track manual pageview
    const timer = setTimeout(() => {
      if (window.posthog && typeof window.posthog.capture === "function") {
        // Get search params from current URL
        const urlSearchParams =
          typeof window !== "undefined" ? window.location.search : "";
        const url = pathname + urlSearchParams;

        console.log("PostHog: Tracking manual page view for", pathname);

        // Track additional page view event for better analytics
        window.posthog.capture("page_view_manual", {
          $current_url: url,
          $pathname: pathname,
          $title: document.title,
          $referrer: document.referrer,
          path: pathname,
          url: url,
          title: document.title,
          category: "navigation",
          timestamp: new Date().toISOString(),
        });
      } else {
        console.log(
          "PostHog: Not yet initialized, manual page view not tracked"
        );
      }
    }, 1000); // Wait 1 second for PostHog to initialize

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

// Hook for tracking custom events
export function usePostHog() {
  const trackEvent = (event: string, properties?: object) => {
    if (window.posthog) {
      console.log("PostHog: Tracking event:", event, properties);
      window.posthog.capture(event, {
        ...properties,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
      });
    } else {
      console.warn(
        "PostHog: Cannot track event - not initialized",
        event,
        properties
      );
    }
  };

  const trackDownload = (
    fileName: string,
    fileType: string,
    source?: string
  ) => {
    trackEvent("file_download", {
      file_name: fileName,
      file_type: fileType,
      source: source || "unknown",
      category: "engagement",
    });
  };

  const trackFormSubmission = (
    formName: string,
    formType: string,
    success: boolean = true
  ) => {
    trackEvent("form_submission", {
      form_name: formName,
      form_type: formType,
      success: success,
      category: "conversion",
    });
  };

  const trackOutboundClick = (url: string, linkText?: string) => {
    trackEvent("outbound_click", {
      url: url,
      link_text: linkText,
      category: "engagement",
    });
  };

  const trackDepartmentView = (
    departmentName: string,
    departmentType: string
  ) => {
    trackEvent("department_view", {
      department_name: departmentName,
      department_type: departmentType,
      category: "content",
    });
  };

  const trackNoticeView = (
    noticeId: string,
    noticeTitle: string,
    noticeCategory?: string
  ) => {
    trackEvent("notice_view", {
      notice_id: noticeId,
      notice_title: noticeTitle,
      notice_category: noticeCategory,
      category: "content",
    });
  };

  const trackEventView = (
    eventId: string,
    eventTitle: string,
    eventType?: string
  ) => {
    trackEvent("event_view", {
      event_id: eventId,
      event_title: eventTitle,
      event_type: eventType,
      category: "content",
    });
  };

  const trackSearch = (query: string, results: number, source: string) => {
    trackEvent("search", {
      query: query,
      results_count: results,
      search_source: source,
      category: "engagement",
    });
  };

  const trackClubView = (clubId: string, clubName: string) => {
    trackEvent("club_view", {
      club_id: clubId,
      club_name: clubName,
      category: "content",
    });
  };

  const trackAdmissionInquiry = (program: string, level: string) => {
    trackEvent("admission_inquiry", {
      program: program,
      level: level,
      category: "conversion",
    });
  };

  const identifyUser = (userId: string, properties?: object) => {
    if (window.posthog) {
      window.posthog.identify(userId, {
        ...properties,
        institution: "Thapathali Campus",
      });
    }
  };

  const setUserProperties = (properties: object) => {
    if (window.posthog) {
      window.posthog.set(properties);
    }
  };

  const trackFeatureUsage = (feature: string, context?: string) => {
    trackEvent("feature_usage", {
      feature: feature,
      context: context,
      category: "engagement",
    });
  };

  const trackError = (
    error: string,
    context?: string,
    severity: "low" | "medium" | "high" = "medium"
  ) => {
    trackEvent("error_occurred", {
      error: error,
      context: context,
      severity: severity,
      category: "error",
    });
  };

  return {
    trackEvent,
    trackDownload,
    trackFormSubmission,
    trackOutboundClick,
    trackDepartmentView,
    trackNoticeView,
    trackEventView,
    trackSearch,
    trackClubView,
    trackAdmissionInquiry,
    trackFeatureUsage,
    trackError,
    identifyUser,
    setUserProperties,
  };
}

export default PostHogAnalytics;
