"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Calendar,
  Users,
  Clock,
  X,
  ChevronRight,
  Filter,
  ChevronDown,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useEvents,
  formatEventDate,
  formatEventDateRange,
  getEventDate,
  getEventEndDate,
  isUpcomingEvent,
  isPastEvent,
  isRunningEvent,
  getEventStatus,
  getEventStatusBadge,
  generateEventSlug,
  type EventType,
} from "@/hooks/use-events";
import type { CampusEvent, ClubEvent, GlobalEvent } from "@/types";

type UnifiedEvent = (CampusEvent | ClubEvent | GlobalEvent) & {
  source: "campus" | "club";
};

export default function StudentClubsPage() {
  // State for filters and pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [eventFilter, setEventFilter] = useState<"upcoming" | "past" | "all">(
    "all"
  );
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");
  const [clubFilter, setClubFilter] = useState<string>("all");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

  const eventsPerPage = 12;

  // Memoize the API parameters to prevent unnecessary re-renders
  const apiParams = useMemo(
    () => ({
      page: currentPage,
      limit: eventsPerPage,
      search: debouncedSearchTerm || undefined,
      type: "club" as EventType,
      ordering: "-date",
    }),
    [currentPage, debouncedSearchTerm]
  );

  // API hook
  const { events, loading, error, pagination, refetch } = useEvents(apiParams);

  // Get unique clubs and event types for filter options
  const uniqueClubs = useMemo(() => {
    const clubs = new Set<string>();
    events.forEach((event: any) => {
      if (event.clubs && event.clubs.length > 0) {
        event.clubs.forEach((club: any) => clubs.add(club.name));
      } else if (event.clubName) {
        clubs.add(event.clubName);
      }
    });
    return Array.from(clubs).sort();
  }, [events]);

  const uniqueEventTypes = useMemo(() => {
    const types = new Set<string>();
    events.forEach((event: any) => {
      if (event.eventType) {
        types.add(event.eventType);
      }
    });
    return Array.from(types).sort();
  }, [events]);

  // Filter events by multiple criteria
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Filter by time
    if (eventFilter === "upcoming") {
      filtered = filtered.filter(isUpcomingEvent);
    } else if (eventFilter === "past") {
      filtered = filtered.filter(isPastEvent);
    }

    // Filter by event type
    if (eventTypeFilter !== "all") {
      filtered = filtered.filter(
        (event: any) => event.eventType === eventTypeFilter
      );
    }

    // Filter by club
    if (clubFilter !== "all") {
      filtered = filtered.filter((event: any) => {
        if (event.clubs && event.clubs.length > 0) {
          return event.clubs.some((club: any) => club.name === clubFilter);
        }
        return event.clubName === clubFilter;
      });
    }

    return filtered;
  }, [events, eventFilter, eventTypeFilter, clubFilter]);

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
  }, [debouncedSearchTerm, eventFilter, eventTypeFilter, clubFilter]);

  // Calculate total pages
  const totalPages = Math.ceil(pagination.count / eventsPerPage);

  // Handle filter changes
  const handleClearFilters = () => {
    setSearchTerm("");
    setEventFilter("all");
    setEventTypeFilter("all");
    setClubFilter("all");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Render individual event card
  const renderEventCard = (event: UnifiedEvent) => {
    const globalEvent = event as any;
    const eventStatus = getEventStatus(event as any);

    // Extract club names from GlobalEvent
    const clubNames =
      globalEvent.clubs && globalEvent.clubs.length > 0
        ? globalEvent.clubs.map((club: any) => club.name).join(", ")
        : "Student Club";

    // Get event date (use eventStartDate for GlobalEvent)
    const eventDate = getEventDate(event as any);
    const eventEndDate = getEventEndDate(event as any);

    return (
      <div
        key={event.uuid}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
      >
        {/* Event Image */}
        <div className="relative h-48 bg-gray-200">
          {event.thumbnail ? (
            <Image
              src={event.thumbnail}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <Users className="w-16 h-16 text-gray-400" />
            </div>
          )}
          {/* Event Status Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getEventStatusBadge(
                eventStatus
              )}`}
            >
              {eventStatus.charAt(0).toUpperCase() + eventStatus.slice(1)}
            </span>
          </div>
        </div>

        <div className="p-4">
          {/* Club Name */}
          <div className="flex items-center text-sm text-blue-600 mb-2">
            <Users className="h-4 w-4 mr-1" />
            {clubNames}
          </div>

          {/* Event Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {event.title}
          </h3>

          {/* Event Date */}
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Calendar className="h-4 w-4 mr-2" />
            {eventEndDate && eventDate !== eventEndDate
              ? formatEventDateRange(eventDate, eventEndDate)
              : formatEventDate(eventDate)}
          </div>

          {/* Event Description (if available) */}
          {globalEvent.description && (
            <div
              className="text-gray-600 text-sm mb-4 line-clamp-3"
              dangerouslySetInnerHTML={{
                __html: globalEvent.description,
              }}
            />
          )}

          {/* Read More Button */}
          <Link
            href={`/campus-life/club-events/${generateEventSlug(event.title)}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Read More
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-orange-500 inline-block pb-1 mb-4">
            Student Club Events
          </h1>
          <p className="text-lg text-gray-600">
            Discover events organized by various student clubs and
            organizations.
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          {/* Search Bar - Always visible */}
          <div className="mb-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Events
              </label>
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search club events..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                aria-label="Search club events"
              />
              <Search className="absolute left-3 bottom-2.5 h-5 w-5 text-gray-400" />
              {searchTerm && (
                <button
                  className="absolute right-3 bottom-2.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Filter Toggle Button */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {(eventFilter !== "all" ||
                  eventTypeFilter !== "all" ||
                  clubFilter !== "all") && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Active
                  </span>
                )}
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isFiltersOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Filters Grid - Always visible on desktop, collapsible on mobile */}
          <div className={`${isFiltersOpen ? "block" : "hidden"} md:block`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Time Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  value={eventFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setEventFilter(
                      e.target.value as "upcoming" | "past" | "all"
                    )
                  }
                >
                  <option value="all">All Events</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past Events</option>
                </select>
              </div>

              {/* Event Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  value={eventTypeFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setEventTypeFilter(e.target.value)
                  }
                >
                  <option value="all">All Types</option>
                  {uniqueEventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Club Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Club
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  value={clubFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setClubFilter(e.target.value)
                  }
                >
                  <option value="all">All Clubs</option>
                  {uniqueClubs.map((club) => (
                    <option key={club} value={club}>
                      {club}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Applied Filters and Clear Button */}
          {(searchTerm ||
            eventFilter !== "all" ||
            eventTypeFilter !== "all" ||
            clubFilter !== "all") && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 pt-4 border-t border-gray-200 gap-3">
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {eventFilter !== "all" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Status: {eventFilter}
                    <button
                      onClick={() => setEventFilter("all")}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {eventTypeFilter !== "all" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    Type:{" "}
                    {eventTypeFilter.charAt(0) +
                      eventTypeFilter.slice(1).toLowerCase()}
                    <button
                      onClick={() => setEventTypeFilter("all")}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {clubFilter !== "all" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    Club: {clubFilter}
                    <button
                      onClick={() => setClubFilter("all")}
                      className="ml-2 text-orange-600 hover:text-orange-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors w-full sm:w-auto"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-6 text-right text-sm text-gray-600">
            Showing {filteredEvents.length} of {pagination.count} events
          </div>
        )}

        {/* Events Categorized by Status */}
        {!loading &&
          !error &&
          filteredEvents.length > 0 &&
          (() => {
            const runningEvents = filteredEvents.filter(
              (event) => getEventStatus(event as any) === "running"
            );
            const upcomingEvents = filteredEvents.filter(
              (event) => getEventStatus(event as any) === "upcoming"
            );
            const pastEvents = filteredEvents.filter(
              (event) => getEventStatus(event as any) === "past"
            );

            return (
              <div className="space-y-12">
                {/* Running Events */}
                {runningEvents.length > 0 && (
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Currently Running Events
                      </h2>
                      <span className="ml-3 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {runningEvents.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {runningEvents.map((event) => renderEventCard(event))}
                    </div>
                  </div>
                )}

                {/* Upcoming Events */}
                {upcomingEvents.length > 0 && (
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Upcoming Events
                      </h2>
                      <span className="ml-3 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {upcomingEvents.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {upcomingEvents.map((event) => renderEventCard(event))}
                    </div>
                  </div>
                )}

                {/* Past Events */}
                {pastEvents.length > 0 && (
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Past Events
                      </h2>
                      <span className="ml-3 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                        {pastEvents.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pastEvents.map((event) => renderEventCard(event))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

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
              Error loading club events
            </div>
            <p className="text-gray-600 mb-4">
              We're having trouble loading club events right now. Please try
              again shortly.
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
            <div className="text-gray-600 text-lg mb-4">
              No club events found
            </div>
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
