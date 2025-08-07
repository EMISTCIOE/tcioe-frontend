"use client";

import { useState } from "react";
import { MessageSquare, Send, User, Mail, Hash } from "lucide-react";
import { useFeedback } from "@/hooks/use-feedback";
import type { FeedbackSubmission } from "@/types";

interface CompactSuggestionBoxProps {
  className?: string;
  title?: string;
  placeholder?: string;
}

export function CompactSuggestionBox({
  className = "",
  title = "Quick Feedback",
  placeholder = "Share your thoughts...",
}: CompactSuggestionBoxProps) {
  const { submitFeedback, loading, error, success, reset } = useFeedback();
  const [isExpanded, setIsExpanded] = useState(false);

  const [formData, setFormData] = useState<FeedbackSubmission>({
    fullName: "",
    rollNumber: "",
    email: "",
    feedbackOrSuggestion: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trim all form data before submission
    const trimmedData = {
      fullName: formData.fullName.trim(),
      rollNumber: formData.rollNumber.trim(),
      email: formData.email.trim(),
      feedbackOrSuggestion: formData.feedbackOrSuggestion.trim(),
    };

    // Check if any required field is empty after trimming
    if (
      !trimmedData.fullName ||
      !trimmedData.rollNumber ||
      !trimmedData.email ||
      !trimmedData.feedbackOrSuggestion
    ) {
      return; // Let HTML5 validation handle this
    }

    try {
      await submitFeedback(trimmedData);
      setFormData({
        fullName: "",
        rollNumber: "",
        email: "",
        feedbackOrSuggestion: "",
      });

      // Auto-collapse after success
      setTimeout(() => {
        setIsExpanded(false);
        reset();
      }, 2000);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      reset();
    }
  };

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}
    >
      {/* Header */}
      <button
        onClick={toggleExpanded}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">Click to provide feedback</p>
          </div>
        </div>
        <div
          className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
        >
          ▼
        </div>
      </button>

      {/* Expanded Form */}
      {isExpanded && (
        <div className="border-t p-4">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-green-600 font-medium">
                Thank you for your feedback!
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Quick Fields Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <User className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Full Name"
                    />
                  </div>

                  <div className="relative">
                    <Hash className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Roll Number"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Email"
                    />
                  </div>
                </div>

                {/* Feedback Textarea */}
                <textarea
                  name="feedbackOrSuggestion"
                  value={formData.feedbackOrSuggestion}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder={placeholder}
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-3 w-3" />
                      Submit Feedback
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
