"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Users, X, ChevronRight } from "lucide-react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useUnions, generateUnionSlug } from "@/hooks/use-unions";
import type { Union } from "@/types";

export default function UnionsPage() {
  // State for filters and pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  const unionsPerPage = 12;

  // Memoize the API parameters to prevent unnecessary re-renders
  const apiParams = useMemo(
    () => ({
      page: currentPage,
      limit: unionsPerPage,
      search: debouncedSearchTerm || undefined,
      ordering: "name",
    }),
    [currentPage, debouncedSearchTerm]
  );

  // API hook
  const { unions, loading, error, pagination, refetch } = useUnions(apiParams);

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
  const totalPages = Math.ceil(pagination.count / unionsPerPage);

  // Handle filter changes
  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Extract text from HTML description
  const extractTextFromHtml = (html: string, maxLength: number = 120) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-orange-500 inline-block pb-1 mb-4">
            Unions
          </h1>
          <p className="text-lg text-gray-600">
            Discover the various student unions and organizations that represent
            and serve our diverse student community.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search unions..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                aria-label="Search unions"
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
            Showing {unions.length} of {pagination.count} unions
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
              Error loading unions
            </div>
            <p className="text-gray-600 mb-4">
              We're having trouble fetching the unions list right now. Please
              try again shortly.
            </p>
            <button
              onClick={() => refetch()}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Unions Found */}
        {!loading && !error && unions.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-600 text-lg mb-4">No unions found</div>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? "Try adjusting your search to see more results."
                : "There are currently no unions available."}
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

        {/* Unions Grid */}
        {!loading && !error && unions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unions.map((union) => (
              <div
                key={union.uuid}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group"
              >
                {/* Union Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <Image
                    src={union.thumbnail}
                    alt={union.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6">
                  {/* Union Name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {union.name}
                  </h3>

                  {/* Union Description */}
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3 leading-relaxed">
                    {extractTextFromHtml(union.shortDescription)}
                  </p>

                  {/* Student Union Label */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Student Union</span>
                    </div>
                  </div>

                  {/* Learn More Button */}
                  <Link
                    href={`/campus-life/unions/${generateUnionSlug(
                      union.name
                    )}`}
                    className="inline-flex items-center w-full justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Learn More
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
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
