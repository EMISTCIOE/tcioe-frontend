"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Download as DownloadIcon,
  FileText,
  X,
  ExternalLink,
  Filter,
  Calendar,
} from "lucide-react";
import React from "react";
import { useCampusReports } from "@/hooks/use-campus-reports";
import type { CampusReport } from "@/types";

export default function CampusReportsPage() {
  // State for filters and pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [selectedReportType, setSelectedReportType] = useState<
    "SELF_STUDY" | "ANNUAL" | "FINANCIAL" | "ACADEMIC" | "OTHER" | ""
  >("");

  const reportsPerPage = 10;

  // Memoize the API parameters to prevent unnecessary re-renders
  const apiParams = useMemo(
    () => ({
      page: currentPage,
      limit: reportsPerPage,
      search: debouncedSearchTerm || undefined,
      ordering: "-publishedDate",
      reportType: selectedReportType || undefined,
    }),
    [currentPage, debouncedSearchTerm, selectedReportType]
  );

  // API hook
  const { reports, loading, error, pagination, refetch } =
    useCampusReports(apiParams);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when search or filter changes
  useEffect(() => {
    if ((debouncedSearchTerm || selectedReportType) && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, selectedReportType]);

  // Calculate total pages
  const totalPages = Math.ceil(pagination.count / reportsPerPage);

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
    setSelectedReportType("");
    setCurrentPage(1);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format report type
  const formatReportType = (type: string) => {
    const typeMap: Record<string, string> = {
      SELF_STUDY: "Self Study",
      ANNUAL: "Annual Report",
      FINANCIAL: "Financial Report",
      ACADEMIC: "Academic Report",
      OTHER: "Other",
    };
    return typeMap[type] || type;
  };

  // Get file extension from URL
  const getFileExtension = (url: string) => {
    return url.split(".").pop()?.toUpperCase() || "FILE";
  };

  // Report type options
  const reportTypeOptions = [
    { value: "", label: "All Types" },
    { value: "SELF_STUDY", label: "Self Study" },
    { value: "ANNUAL", label: "Annual Report" },
    { value: "FINANCIAL", label: "Financial Report" },
    { value: "ACADEMIC", label: "Academic Report" },
    { value: "OTHER", label: "Other" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-orange-500 inline-block pb-1 mb-8">
          Campus Reports
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Access official campus reports including annual reports, financial
          documents, and self-study reports.
        </p>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                aria-label="Search reports"
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

            {/* Report Type Filter */}
            <div className="relative min-w-[200px]">
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={selectedReportType}
                onChange={(e) =>
                  setSelectedReportType(
                    e.target.value as typeof selectedReportType
                  )
                }
                aria-label="Filter by report type"
              >
                {reportTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || selectedReportType) && (
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
            Showing {reports.length} of {pagination.count} reports
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
              Error loading reports
            </div>
            <p className="text-gray-600 mb-4">
              We're having trouble loading campus reports right now. Please try again shortly.
            </p>
            <button
              onClick={() => refetch()}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Reports Found */}
        {!loading && !error && reports.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-600 text-lg mb-4">No reports found</div>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedReportType
                ? "Try adjusting your search criteria to see more results."
                : "There are currently no reports available."}
            </p>
            {(searchTerm || selectedReportType) && (
              <button
                onClick={handleClearFilters}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Reports List */}
        {!loading && !error && reports.length > 0 && (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.uuid}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {formatReportType(report.reportType)} -{" "}
                            {report.fiscalSession.sessionFull}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(report.publishedDate)}</span>
                            <span>•</span>
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                              {getFileExtension(report.file)}
                            </span>
                            <span>•</span>
                            <span className="bg-blue-100 px-2 py-1 rounded text-xs text-blue-700">
                              {formatReportType(report.reportType)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-gray-600 text-sm mb-4">
                        <p>
                          Fiscal Year:{" "}
                          <span className="font-medium">
                            {report.fiscalSession.sessionShort}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <a
                        href={report.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Download
                      </a>
                      <a
                        href={report.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
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
