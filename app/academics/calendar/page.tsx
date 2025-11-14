"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Download as DownloadIcon,
  Calendar,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
  FileText,
  ExternalLink,
} from "lucide-react";
import React from "react";
import {
  useAcademicCalendars,
  formatProgramType,
  formatAcademicYear,
} from "@/hooks/use-academic-calendars";
import type { AcademicCalendar } from "@/types";

export default function ResourcesAcademicCalendarPage() {
  // State for filters and pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [selectedProgramType, setSelectedProgramType] = useState<string>("");
  const [expandedCalendar, setExpandedCalendar] = useState<string | null>(null);

  const calendarsPerPage = 10;

  // Memoize the API parameters to prevent unnecessary re-renders
  const apiParams = useMemo(
    () => ({
      page: currentPage,
      limit: calendarsPerPage,
      search: debouncedSearchTerm || undefined,
      programType: selectedProgramType || undefined,
      ordering: "-startYear",
    }),
    [currentPage, debouncedSearchTerm, selectedProgramType]
  );

  // API hook
  const { calendars, loading, error, pagination, refetch } =
    useAcademicCalendars(apiParams);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when search or filter changes
  useEffect(() => {
    if ((debouncedSearchTerm || selectedProgramType) && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, selectedProgramType]);

  // Calculate total pages
  const totalPages = Math.ceil(pagination.count / calendarsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedProgramType("");
    setCurrentPage(1);
  };

  // Handle toggle PDF preview
  const handleTogglePreview = (calendarId: string) => {
    setExpandedCalendar(expandedCalendar === calendarId ? null : calendarId);
  };

  // Program type options
  const programTypeOptions = [
    { value: "", label: "All Programs" },
    { value: "BACHELORS", label: "Bachelor's" },
    { value: "MASTERS", label: "Master's" },
    { value: "DIPLOMA", label: "Diploma" },
    { value: "OTHER", label: "Other" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-orange-500 inline-block pb-1 mb-8">
          Academic Calendar
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Access official academic calendars for all programs and academic
          years.
        </p>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search calendars..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                aria-label="Search calendars"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              {searchTerm && (
                <button
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Program Type Filter */}
            <div className="relative min-w-[200px]">
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={selectedProgramType}
                onChange={(e) => setSelectedProgramType(e.target.value)}
                aria-label="Filter by program type"
              >
                {programTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || selectedProgramType) && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-6 text-right text-sm text-gray-600">
            Showing {calendars.length} of {pagination.count} calendars
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="text-red-600 text-lg mb-4">
              Error loading calendars
            </div>
            <p className="text-gray-600 mb-4">
              We're having trouble showing academic calendars right now. Please try again shortly.
            </p>
            <button
              onClick={() => refetch()}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Calendars Found */}
        {!loading && !error && calendars.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-600 text-lg mb-4">No calendars found</div>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedProgramType
                ? "Try adjusting your search criteria to see more results."
                : "There are currently no academic calendars available."}
            </p>
            {(searchTerm || selectedProgramType) && (
              <button
                onClick={handleClearFilters}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Calendars List */}
        {!loading && !error && calendars.length > 0 && (
          <div className="space-y-4">
            {calendars.map((calendar) => (
              <div
                key={calendar.uuid}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {formatProgramType(calendar.programType)} Academic
                            Calendar
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>
                              Academic Year:{" "}
                              {formatAcademicYear(
                                calendar.startYear,
                                calendar.endYear
                              )}
                            </span>
                            <span>•</span>
                            <span className="bg-blue-100 px-2 py-1 rounded text-xs text-blue-700">
                              {formatProgramType(calendar.programType)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleTogglePreview(calendar.uuid)}
                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        {expandedCalendar === calendar.uuid ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-2" />
                            Hide Preview
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4 mr-2" />
                            Preview
                          </>
                        )}
                      </button>
                      <a
                        href={calendar.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Download
                      </a>
                      <a
                        href={calendar.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* PDF Preview */}
                {expandedCalendar === calendar.uuid && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    <div className="p-4">
                      <div
                        className="bg-white rounded border overflow-hidden"
                        style={{ height: "600px" }}
                      >
                        <iframe
                          src={`${calendar.file}#toolbar=1&navpanes=0&scrollbar=1`}
                          className="w-full h-full"
                          title={`${formatProgramType(
                            calendar.programType
                          )} Academic Calendar ${formatAcademicYear(
                            calendar.startYear,
                            calendar.endYear
                          )}`}
                        />
                      </div>
                      <div className="mt-3 text-center">
                        <p className="text-sm text-gray-600">
                          Preview of {formatProgramType(calendar.programType)}{" "}
                          Academic Calendar for{" "}
                          {formatAcademicYear(
                            calendar.startYear,
                            calendar.endYear
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded"
              >
                ‹
              </button>

              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                let page;
                if (totalPages <= 10) {
                  page = i + 1;
                } else if (currentPage <= 5) {
                  page = i + 1;
                } else if (currentPage > totalPages - 5) {
                  page = totalPages - 9 + i;
                } else {
                  page = currentPage - 4 + i;
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm font-medium border rounded ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "text-gray-700 hover:text-blue-600 border-gray-300 hover:border-blue-600"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              {totalPages > 10 && currentPage < totalPages - 5 && (
                <>
                  <span className="px-2 text-gray-500">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-2 text-sm text-gray-700 hover:text-blue-600 border border-gray-300 rounded hover:border-blue-600"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
