"use client";

import { useState } from "react";
import { MessageSquare, X, Send, User, Mail, Hash, MessageCircle } from "lucide-react";
import type { FeedbackSubmission } from "@/types";

export function SuggestionBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FeedbackSubmission>({
    fullName: "",
    rollNumber: "",
    email: "",
    feedbackOrSuggestion: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to submit feedback");
      }

      setSubmitted(true);
      setFormData({
        fullName: "",
        rollNumber: "",
        email: "",
        feedbackOrSuggestion: "",
      });

      // Auto-close after success
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    setError(null);
    setSubmitted(false);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={toggleOpen}
        className={`fixed top-1/2 right-0 transform -translate-y-1/2 z-40 transition-all duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-2'
        }`}
        aria-label="Open suggestion box"
      >
        <div className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-l-lg shadow-lg flex items-center gap-2 min-w-[120px]">
          <MessageSquare className="h-5 w-5" />
          <span className="font-medium text-sm">Feedback</span>
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={toggleOpen}
        />
      )}

      {/* Suggestion Box Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Feedback & Suggestions</h2>
            </div>
            <button
              onClick={toggleOpen}
              className="p-1 hover:bg-blue-700 rounded"
              aria-label="Close suggestion box"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600">
                  Your feedback has been submitted successfully. We appreciate your input and will review it carefully.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    We value your feedback and suggestions. Please share your thoughts, concerns, or ideas to help us improve our campus services and facilities.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-600 text-sm">
                      Something went wrong while submitting your feedback. Please try again shortly.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Roll Number */}
                  <div>
                    <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Roll Number *
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        id="rollNumber"
                        name="rollNumber"
                        value={formData.rollNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your roll number"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  {/* Feedback */}
                  <div>
                    <label htmlFor="feedbackOrSuggestion" className="block text-sm font-medium text-gray-700 mb-1">
                      Feedback or Suggestion *
                    </label>
                    <textarea
                      id="feedbackOrSuggestion"
                      name="feedbackOrSuggestion"
                      value={formData.feedbackOrSuggestion}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Share your feedback, suggestions, or concerns..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Feedback
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 p-4">
            <p className="text-xs text-gray-500 text-center">
              Your feedback is important to us and helps improve our campus services.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
