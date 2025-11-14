"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Download as DownloadIcon,
  FileText,
  X,
  ExternalLink,
} from "lucide-react";
import React from "react";
import { useDownloads } from "@/hooks/use-downloads";
import type { Download } from "@/types";

export default function DownloadsPage() {
  // State for filters and pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  const downloadsPerPage = 10;

  // Memoize the API parameters to prevent unnecessary re-renders
  const apiParams = useMemo(
    () => ({
      page: currentPage,
      limit: downloadsPerPage,
      search: debouncedSearchTerm || undefined,
      ordering: "-createdAt",
    }),
    [currentPage, debouncedSearchTerm]
  );

  // API hook
  const { downloads, loading, error, pagination, refetch } =
    useDownloads(apiParams);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when search changes
  useEffect(() => {
    if (debouncedSearchTerm && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  // Calculate total pages
  const totalPages = Math.ceil(pagination.count / downloadsPerPage);

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

  // Format file size (if available in the future)
  const getFileExtension = (url: string) => {
    return url.split(".").pop()?.toUpperCase() || "FILE";
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Extract text from HTML description
  const extractTextFromHtml = (html: string, maxLength: number = 150) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-orange-500 inline-block pb-1 mb-8">
          Downloads
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Access various downloadable documents and forms.
        </p>

        {/* Search Section */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search downloads..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                aria-label="Search downloads"
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
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-6 text-right text-sm text-gray-600">
            Showing {downloads.length} of {pagination.count} downloads
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
              Error loading downloads
            </div>
            <p className="text-gray-600 mb-4">
              We're having trouble loading resource downloads right now. Please try again shortly.
            </p>
            <button
              onClick={() => refetch()}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Downloads Found */}
        {!loading && !error && downloads.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-600 text-lg mb-4">No downloads found</div>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? "Try adjusting your search to see more results."
                : "There are currently no downloads available."}
            </p>
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Downloads List */}
        {!loading && !error && downloads.length > 0 && (
          <div className="space-y-4">
            {downloads.map((download) => (
              <div
                key={download.uuid}
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
                            {download.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{formatDate(download.createdAt)}</span>
                            <span>•</span>
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                              {getFileExtension(download.file)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {download.description && (
                        <div
                          className="text-gray-600 text-sm mb-4 line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: extractTextFromHtml(
                              download.description,
                              200
                            ),
                          }}
                        />
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <a
                        href={download.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Download
                      </a>
                      <a
                        href={download.file}
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
