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
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
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
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      ordering: "-published_at",
      is_approved_by_campus: true,
    }),
    [
      currentPage,
      debouncedSearchTerm,
      selectedCategory,
      selectedDepartment,
      startDate,
      endDate,
    ]
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
    if (startDate) filters.push(`Start Date: ${formatNoticeDate(startDate)}`);
    if (endDate) filters.push(`End Date: ${formatNoticeDate(endDate)}`);
    return filters;
  }, [
    selectedCategory,
    selectedDepartment,
    searchTerm,
    categories,
    departments,
    startDate,
    endDate,
  ]);

  // Reset to first page when filters change (only when not already on page 1)
  useEffect(() => {
    const shouldReset =
      (debouncedSearchTerm ||
        selectedCategory ||
        selectedDepartment ||
        startDate ||
        endDate) &&
      currentPage !== 1;
    if (shouldReset) {
      setCurrentPage(1);
    }
  }, [
    debouncedSearchTerm,
    selectedCategory,
    selectedDepartment,
    startDate,
    endDate,
    currentPage,
  ]);

  // Calculate total pages
  const totalPages = Math.ceil(pagination.count / noticesPerPage);

  // Loading state
  const isLoading = noticesLoading || categoriesLoading || departmentsLoading;

  // Handle filter changes
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("");
    setSelectedCategory("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const removeFilter = (filterToRemove: string) => {
    if (filterToRemove.startsWith("Search:")) {
      setSearchTerm("");
      return;
    }
    if (filterToRemove.startsWith("Start Date:")) {
      setStartDate("");
      return;
    }
    if (filterToRemove.startsWith("End Date:")) {
      setEndDate("");
      return;
    }

    const category = categories.find((cat) => cat.name === filterToRemove);
    const department = departments.find(
      (dept) => dept.name === filterToRemove
    );

    if (category) {
      setSelectedCategory("");
    } else if (department) {
      setSelectedDepartment("");
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Notices and Announcements
          </h1>
          <div className="w-20 h-1 bg-orange-500 rounded-full"></div>
        </div>

        {/* Search and Filters Section - matching the UI exactly */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 space-y-4">
            <div className="grid gap-4">
              <div className="relative">
                <input
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-500"
                  placeholder="Search notices..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  aria-label="Search notices"
                />
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                {searchTerm && (
                  <button
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm text-gray-700"
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
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm text-gray-700"
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
              <div className="grid gap-4 md:grid-cols-2">
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 bg-white"
                    value={startDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setStartDate(e.target.value)
                    }
                    aria-label="Filter start date"
                    placeholder="From date"
                    max={endDate || undefined}
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 bg-white"
                    value={endDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEndDate(e.target.value)
                    }
                    aria-label="Filter end date"
                    placeholder="To date"
                    min={startDate || undefined}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm">
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
              </div>
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
                    className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
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
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{formatNoticeDate(notice.publishedAt)}</span>
                      <span>|</span>
                      <span>
                        {notice.department?.name ?? "College Wide"}
                      </span>
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
                    href={`/notices/${notice.slug}`}
                    className="block hover:text-blue-600 transition-colors"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 line-clamp-2 leading-tight">
                      {notice.title}
                    </h3>
                  </Link>

                  {/* Description */}
                  {notice.description && (
                    <div className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {extractTextFromHtml(notice.description, 150)}
                    </div>
                  )}

                  {/* Bottom row - Read More button and Media icons */}
                  <div className="flex justify-between items-center pt-2">
                    <Link
                      href={`/notices/${notice.slug}`}
                      className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
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
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
              >
                ‹
              </button>

              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let page;
                if (totalPages <= 7) {
                  page = i + 1;
                } else if (currentPage <= 4) {
                  page = i + 1;
                } else if (currentPage > totalPages - 4) {
                  page = totalPages - 6 + i;
                } else {
                  page = currentPage - 3 + i;
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-700 hover:text-blue-600 border border-gray-300 hover:bg-gray-50 bg-white"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              {totalPages > 7 && currentPage < totalPages - 3 && (
                <>
                  <span className="px-2 py-2 text-gray-500">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-2 text-sm text-gray-700 hover:text-blue-600 border border-gray-300 hover:bg-gray-50 bg-white rounded-md transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
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
