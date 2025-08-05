"use client";

import { useState } from "react";
import { Send, MessageSquare, CheckCircle, AlertTriangle } from "lucide-react";
import { useFeedback } from "@/hooks/use-feedback";

export default function SuggestionBoxPage() {
  const { submitFeedback, loading, error, success, reset } = useFeedback();
  const [formData, setFormData] = useState({
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
      const result = await submitFeedback(trimmedData);
      if (result.success) {
        // Reset form on success
        setFormData({
          fullName: "",
          rollNumber: "",
          email: "",
          feedbackOrSuggestion: "",
        });

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          reset();
        }, 5000);
      }
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-6">
            <MessageSquare className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Suggestion Box
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your voice matters! Share your feedback, suggestions, and ideas to
            help us improve IOE Thapathali Campus. Every suggestion is valued
            and reviewed by our administration.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  Thank you for your feedback!
                </h3>
                <p className="text-green-700">
                  Your suggestion has been successfully submitted and will be
                  reviewed by our team.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">
                  Error submitting feedback
                </h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Suggestion Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">
              Share Your Thoughts
            </h2>
            <p className="text-blue-100 mt-2">
              Help us create a better learning environment for everyone
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Roll Number */}
              <div>
                <label
                  htmlFor="rollNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Roll Number *
                </label>
                <input
                  type="text"
                  id="rollNumber"
                  name="rollNumber"
                  required
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your roll number"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your email address"
              />
            </div>

            {/* Feedback/Suggestion */}
            <div className="mb-8">
              <label
                htmlFor="feedbackOrSuggestion"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Feedback or Suggestion *
              </label>
              <textarea
                id="feedbackOrSuggestion"
                name="feedbackOrSuggestion"
                required
                rows={6}
                value={formData.feedbackOrSuggestion}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
                placeholder="Share your thoughts, suggestions, or feedback about any aspect of campus life, academics, facilities, or services..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
