"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Calendar,
  Download,
  ExternalLink,
  Filter,
  X,
  Eye,
  Share2,
  FileText,
  Image,
  Video,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  useNotices,
  useNoticeCategories,
  useNoticeDepartments,
} from "@/hooks/use-notices";
import {
  getCategoryColor,
  formatNoticeDate,
  formatRelativeDate,
  extractTextFromHtml,
  isDownloadableDocument,
  getMediaTypeIcon,
} from "@/lib/notices-utils";
import type { Notice } from "@/types";

export default function NoticesPage() {
  // State for filters and pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  const noticesPerPage = 10;

  // Memoize the API parameters to prevent unnecessary re-renders
  const apiParams = useMemo(
    () => ({
      page: currentPage,
      limit: noticesPerPage,
      search: debouncedSearchTerm || undefined,
      category: selectedCategory || undefined,
      department: selectedDepartment || undefined,
      ordering: "-published_at",
    }),
    [currentPage, debouncedSearchTerm, selectedCategory, selectedDepartment]
  );

  // API hooks
  const {
    notices,
    loading: noticesLoading,
    error: noticesError,
    pagination,
    refetch: refetchNotices,
  } = useNotices(apiParams);

  const { categories, loading: categoriesLoading } = useNoticeCategories();

  const { departments, loading: departmentsLoading } = useNoticeDepartments();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Memoize active filters to prevent infinite loops
  const activeFilters = useMemo(() => {
    const filters: string[] = [];
    if (selectedCategory && categories.length > 0) {
      const category = categories.find((cat) => cat.uuid === selectedCategory);
      if (category) filters.push(category.name);
    }
    if (selectedDepartment && departments.length > 0) {
      const department = departments.find(
        (dept) => dept.uuid === selectedDepartment
      );
      if (department) filters.push(department.name);
    }
    if (searchTerm) filters.push(`Search: ${searchTerm}`);
    return filters;
  }, [
    selectedCategory,
    selectedDepartment,
    searchTerm,
    categories,
    departments,
  ]);

  // Reset to first page when filters change (only when not already on page 1)
  useEffect(() => {
    const shouldReset =
      (debouncedSearchTerm || selectedCategory || selectedDepartment) &&
      currentPage !== 1;
    if (shouldReset) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, selectedCategory, selectedDepartment]);

  // Calculate total pages
  const totalPages = Math.ceil(pagination.count / noticesPerPage);

  // Loading state
  const isLoading = noticesLoading || categoriesLoading || departmentsLoading;

  // Handle filter changes
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("");
    setSelectedCategory("");
    setCurrentPage(1);
  };

  const removeFilter = (filterToRemove: string) => {
    if (filterToRemove.startsWith("Search:")) {
      setSearchTerm("");
    } else {
      const category = categories.find((cat) => cat.name === filterToRemove);
      const department = departments.find(
        (dept) => dept.name === filterToRemove
      );

      if (category) {
        setSelectedCategory("");
      } else if (department) {
        setSelectedDepartment("");
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNoticeClick = async (notice: Notice) => {
    // You can implement view tracking here
    console.log("Notice clicked:", notice.title);
  };

  const renderMediaIcons = (notice: Notice) => {
    const downloadableMedia = notice.medias.filter((media) =>
      isDownloadableDocument(media.mediaType, media.file)
    );

    if (downloadableMedia.length === 0) return null;

    return (
      <div className="flex items-center gap-2 mt-2">
        {downloadableMedia.map((media, index) => {
          const iconName = getMediaTypeIcon(media.mediaType, media.file);
          return (
            <a
              key={media.uuid}
              href={media.file}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
              title={media.caption}
            >
              {media.mediaType === "DOCUMENT" && (
                <FileText className="h-4 w-4" />
              )}
              {media.mediaType === "IMAGE" && <Image className="h-4 w-4" />}
              {media.mediaType === "VIDEO" && <Video className="h-4 w-4" />}
              <Download className="h-3 w-3" />
            </a>
          );
        })}
      </div>
    );
  };

  // Category badge colors matching the UI
  const getCategoryBadgeColor = (categoryName: string) => {
    switch (categoryName?.toLowerCase()) {
      case "academic":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-red-100 text-red-800";
      case "financial":
        return "bg-purple-100 text-purple-800";
      case "events":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header matching the image design exactly */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Notices and Announcements
          </h1>
          <div className="w-24 h-1 bg-orange-500"></div>
        </div>

        {/* Search and Filters Section - matching the UI exactly */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <input
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Search notices..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  aria-label="Search notices"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                {searchTerm && (
                  <button
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Department Filter */}
              <div className="flex-shrink-0">
                <select
                  className="px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-48 text-sm"
                  value={selectedDepartment}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedDepartment(e.target.value)
                  }
                  disabled={departmentsLoading}
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.uuid} value={dept.uuid}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex-shrink-0">
                <select
                  className="px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-48 text-sm"
                  value={selectedCategory}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedCategory(e.target.value)
                  }
                  disabled={categoriesLoading}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.uuid} value={category.uuid}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Button - Matching the blue color from UI */}
              <button className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium">
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-sm text-gray-600 font-medium">
                Active Filters:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center bg-blue-100 text-blue-800px-3 py-1 rounded-full text-sm"
                  >
                    {filter}
                    <button
                      onClick={() => removeFilter(filter)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                      aria-label={`Remove ${filter} filter`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-red-600 hover:text-red-800 ml-2 underline"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && (
          <div className="mb-4 text-right text-sm text-gray-600">
            Showing {notices.length} of {pagination.count} notices
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {noticesError && (
          <div className="text-center py-20">
            <div className="text-red-600 text-lg mb-4">
              Error loading notices
            </div>
            <p className="text-gray-600 mb-4">{noticesError}</p>
            <button
              onClick={() => refetchNotices()}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Notices Found */}
        {!isLoading && !noticesError && notices.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-600 text-lg mb-4">No notices found</div>
            <p className="text-gray-500 mb-4">
              {activeFilters.length > 0
                ? "Try adjusting your filters to see more results."
                : "There are currently no notices available."}
            </p>
            {activeFilters.length > 0 && (
              <button
                onClick={handleClearFilters}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Notices List - Matching the exact card design from UI */}
        {!isLoading && !noticesError && notices.length > 0 && (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice.uuid}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="p-6">
                  {/* Date, Department, and Category - Top row */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{formatNoticeDate(notice.publishedAt)}</span>
                      <span>|</span>
                      <span>{notice.department.name}</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(
                        notice.category.name
                      )}`}
                    >
                      {notice.category.name}
                    </span>
                  </div>

                  {/* Title */}
                  <Link
                    href={`/notices/${notice.uuid}`}
                    className="block hover:text-blue-600 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 hover:text-blue-600 line-clamp-2">
                      {notice.title}
                    </h3>
                  </Link>

                  {/* Description */}
                  {notice.description && (
                    <div className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {extractTextFromHtml(notice.description, 150)}
                    </div>
                  )}

                  {/* Bottom row - Read More button and Media icons */}
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/notices/${notice.uuid}`}
                      className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Read More
                    </Link>

                    {renderMediaIcons(notice)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination - Matching the UI design */}
        {!isLoading && !noticesError && totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded-l-md bg-white"
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
                    className={`px-3 py-2 text-sm font-medium border-t border-b ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "text-gray-700 hover:text-blue-600 border-gray-300 hover:bg-gray-50 bg-white"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              {totalPages > 10 && currentPage < totalPages - 5 && (
                <>
                  <span className="px-2 py-2 text-gray-500 border-t border-b border-gray-300 bg-white">
                    ...
                  </span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-2 text-sm text-gray-700 hover:text-blue-600 border-t border-b border-gray-300 hover:bg-gray-50 bg-white"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded-r-md bg-white"
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
