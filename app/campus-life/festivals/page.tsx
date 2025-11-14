"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  Filter,
  X,
  ExternalLink,
  Users,
  Tag,
  ChevronRight,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useEvents,
  formatEventDateRange,
  isUpcomingEvent,
  isPastEvent,
  generateEventSlug,
  type EventType,
  type CampusEventType,
} from "@/hooks/use-events";
import type { CampusEvent, ClubEvent } from "@/types";

type UnifiedEvent = (CampusEvent | ClubEvent) & {
  source: "campus" | "club";
};

export default function CampusFestivalsPage() {
  // State for filters and pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedEventType, setSelectedEventType] = useState<
    CampusEventType | ""
  >("");
  const [eventFilter, setEventFilter] = useState<"upcoming" | "past" | "all">(
    "all"
  );
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  const eventsPerPage = 12;

  // Memoize the API parameters to prevent unnecessary re-renders
  const apiParams = useMemo(
    () => ({
      page: currentPage,
      limit: eventsPerPage,
      search: debouncedSearchTerm || undefined,
      type: "campus" as EventType,
      eventType: selectedEventType || undefined,
      ordering: "-eventStartDate",
    }),
    [currentPage, debouncedSearchTerm, selectedEventType]
  );

  // API hook
  const { events, loading, error, pagination, refetch } = useEvents(apiParams);

  // Filter events by time (upcoming/past)
  const filteredEvents = useMemo(() => {
    if (eventFilter === "all") return events;
    if (eventFilter === "upcoming") return events.filter(isUpcomingEvent);
    if (eventFilter === "past") return events.filter(isPastEvent);
    return events;
  }, [events, eventFilter]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, selectedEventType, eventFilter]);

  // Calculate total pages
  const totalPages = Math.ceil(pagination.count / eventsPerPage);

  // Handle filter changes
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedEventType("");
    setEventFilter("all");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get event type color
  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case "CULTURAL":
        return "bg-purple-100 text-purple-800";
      case "ACADEMIC":
        return "bg-blue-100 text-blue-800";
      case "SPORTS":
        return "bg-green-100 text-green-800";
      case "TECHNICAL":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-orange-500 inline-block pb-1 mb-4">
            Campus Festivals
          </h1>
          <p className="text-lg text-gray-600">
            Stay updated with the latest campus events, festivals, and cultural
            programs.
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                aria-label="Search events"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              {searchTerm && (
                <button
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Event Type Filter */}
            <div className="flex-shrink-0">
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-48"
                value={selectedEventType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedEventType(e.target.value as CampusEventType | "")
                }
              >
                <option value="">All Event Types</option>
                <option value="CULTURAL">Cultural</option>
                <option value="ACADEMIC">Academic</option>
                <option value="SPORTS">Sports</option>
                <option value="TECHNICAL">Technical</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Time Filter */}
            <div className="flex-shrink-0">
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-48"
                value={eventFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setEventFilter(e.target.value as "upcoming" | "past" | "all")
                }
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming Events</option>
                <option value="past">Past Events</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-6 text-right text-sm text-gray-600">
            Showing {filteredEvents.length} of {pagination.count} events
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
              Error loading events
            </div>
            <p className="text-gray-600 mb-4">
              We're having trouble loading festival events right now. Please try again shortly.
            </p>
            <button
              onClick={() => refetch()}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Events Found */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-600 text-lg mb-4">No events found</div>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters to see more results.
            </p>
            <button
              onClick={handleClearFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const campusEvent = event as CampusEvent;
              const isUpcoming = isUpcomingEvent(event);

              return (
                <div
                  key={event.uuid}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
                >
                  {/* Event Image */}
                  <div className="relative h-48 bg-gray-200">
                    <Image
                      src={event.thumbnail}
                      alt={event.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Event Type Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(
                          campusEvent.eventType
                        )}`}
                      >
                        {campusEvent.eventType}
                      </span>
                    </div>
                    {/* Upcoming/Past Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isUpcoming
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {isUpcoming ? "Upcoming" : "Past"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Event Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Event Date */}
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatEventDateRange(
                        campusEvent.eventStartDate,
                        campusEvent.eventEndDate
                      )}
                    </div>

                    {/* Event Description */}
                    {campusEvent.descriptionShort && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {campusEvent.descriptionShort}
                      </p>
                    )}

                    {/* Read More Button */}
                    <Link
                      href={`/campus-life/festivals/${generateEventSlug(
                        event.title,
                        (event as CampusEvent).eventStartDate ||
                          (event as ClubEvent).date
                      )}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Read More
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
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
