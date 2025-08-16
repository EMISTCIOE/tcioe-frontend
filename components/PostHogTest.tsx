"use client";

import { useEffect, useState } from "react";
import { usePostHog } from "@/components/PostHogAnalytics";

export function PostHogTest() {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading"
  );
  const { trackEvent } = usePostHog();

  useEffect(() => {
    // Check PostHog status
    const checkPostHog = () => {
      if (window.posthog) {
        setStatus("loaded");
        console.log("PostHog Test: PostHog is available");
      } else {
        console.log(
          "PostHog Test: PostHog not yet available, checking again..."
        );
        setTimeout(checkPostHog, 1000);
      }
    };

    // Start checking
    checkPostHog();

    // Set timeout for error state
    const timeout = setTimeout(() => {
      if (status === "loading") {
        setStatus("error");
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [status]);

  const testEvent = () => {
    trackEvent("posthog_test_button_clicked", {
      test_type: "manual",
      timestamp: new Date().toISOString(),
      source: "posthog_test_component",
    });

    // Also try direct PostHog call
    if (window.posthog) {
      window.posthog.capture("direct_posthog_test", {
        test_type: "direct_call",
        timestamp: new Date().toISOString(),
      });
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "loaded":
        return "text-green-600 bg-green-50 border-green-200";
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "loaded":
        return "✅ PostHog Loaded Successfully";
      case "error":
        return "❌ PostHog Failed to Load";
      default:
        return "⏳ Loading PostHog...";
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-4">PostHog Analytics Test</h3>

      <div className={`p-3 rounded border ${getStatusColor()} mb-4`}>
        <p className="font-medium">{getStatusText()}</p>
        {status === "loaded" && (
          <p className="text-sm mt-1">PostHog is ready to track events</p>
        )}
        {status === "error" && (
          <p className="text-sm mt-1">Check console for error details</p>
        )}
      </div>

      {status === "loaded" && (
        <div className="space-y-3">
          <button
            onClick={testEvent}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Test PostHog Event
          </button>

          <div className="text-sm text-gray-600">
            <p>
              <strong>Instructions:</strong>
            </p>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>Click the test button above</li>
              <li>Open browser console to see tracking logs</li>
              <li>Check your PostHog dashboard for events</li>
              <li>
                Look for "posthog_test_button_clicked" and "direct_posthog_test"
                events
              </li>
            </ol>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <p>
              <strong>Environment Variables:</strong>
            </p>
            <p>
              PostHog Key:{" "}
              {process.env.NEXT_PUBLIC_POSTHOG_KEY
                ? `${process.env.NEXT_PUBLIC_POSTHOG_KEY.substring(0, 10)}...`
                : "Not Set"}
            </p>
            <p>
              PostHog Host: {process.env.NEXT_PUBLIC_POSTHOG_HOST || "Not Set"}
            </p>
            <p>Environment: {process.env.NODE_ENV}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostHogTest;
