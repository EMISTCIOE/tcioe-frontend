import { useState, useCallback } from "react";
import type { FeedbackSubmission, FeedbackResponse } from "@/types";

interface UseFeedbackReturn {
  submitFeedback: (data: FeedbackSubmission) => Promise<FeedbackResponse>;
  loading: boolean;
  error: string | null;
  success: boolean;
  reset: () => void;
}

export function useFeedback(): UseFeedbackReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const submitFeedback = useCallback(
    async (data: FeedbackSubmission): Promise<FeedbackResponse> => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          let errorMessage = "Failed to submit feedback";

          if (errorData.details) {
            errorMessage = errorData.details;
          } else if (errorData.message) {
            // Handle array of messages or single message
            if (Array.isArray(errorData.message)) {
              errorMessage = errorData.message.join(", ");
            } else {
              errorMessage = errorData.message;
            }
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }

          throw new Error(errorMessage);
        }

        const result: FeedbackResponse = await response.json();
        setSuccess(true);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    submitFeedback,
    loading,
    error,
    success,
    reset,
  };
}
