"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Calendar,
  Users,
  Clock,
  Filter,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatedSection } from "@/components/animated-section";
import { useEvents, type EventType } from "@/hooks/use-events";
import type { CampusEvent, ClubEvent } from "@/types";

type UnifiedEvent = (CampusEvent | ClubEvent) & {
  source: "campus" | "club";
};

export default function AllEventsPage() {
  // State for filters and pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [eventTypeFilter, setEventTypeFilter] = useState<EventType>("all");
  const [timeFilter, setTimeFilter] = useState<"upcoming" | "past" | "all">(
    "all"
  );

  const eventsPerPage = 12;

  // API parameters
  const apiParams = useMemo(
    () => ({
      page: currentPage,
      limit: eventsPerPage,
      search: searchTerm || undefined,
      type: eventTypeFilter,
      ordering: "-eventStartDate,-date",
    }),
    [currentPage, searchTerm, eventTypeFilter]
  );

  // API hook
  const { events, loading, error, pagination } = useEvents(apiParams);

  // Filter events by time
  const filteredEvents = useMemo(() => {
    if (timeFilter === "all") return events;

    const now = new Date();
    return events.filter((event: UnifiedEvent) => {
      const eventDate = new Date(
        event.source === "campus"
          ? (event as CampusEvent).eventStartDate
          : (event as ClubEvent).date
      );

      if (timeFilter === "upcoming") {
        return eventDate >= now;
      } else {
        return eventDate < now;
      }
    });
  }, [events, timeFilter]);

  const formatEventDate = (event: UnifiedEvent) => {
    const dateString =
      event.source === "campus"
        ? (event as CampusEvent).eventStartDate
        : (event as ClubEvent).date;

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getEventTypeColor = (event: UnifiedEvent) => {
    if (event.source === "campus") {
      const campusEvent = event as CampusEvent;
      switch (campusEvent.eventType) {
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
    } else {
      return "bg-indigo-100 text-indigo-800";
    }
  };

  const getEventTypeLabel = (event: UnifiedEvent) => {
    if (event.source === "campus") {
      const campusEvent = event as CampusEvent;
      return (
        campusEvent.eventType?.charAt(0) +
          campusEvent.eventType?.slice(1).toLowerCase() || "Campus Event"
      );
    } else {
      return "Club Event";
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    if (!pagination || pagination.count <= eventsPerPage) return null;

    const totalPages = Math.ceil(pagination.count / eventsPerPage);
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        pages.push(i);
      } else if (
        (i === currentPage - 3 && i > 1) ||
        (i === currentPage + 3 && i < totalPages)
      ) {
        pages.push("...");
      }
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!pagination.previous}
          className="px-3 py-1"
        >
          Previous
        </Button>

        {pages.map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-3 py-1 text-gray-500">...</span>
            ) : (
              <Button
                variant={page === currentPage ? "default" : "outline"}
                onClick={() => handlePageChange(page as number)}
                className="px-3 py-1"
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}

        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!pagination.next}
          className="px-3 py-1"
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Campus Events
            </h1>
            <p className="text-xl text-center text-blue-100 max-w-3xl mx-auto">
              Discover upcoming campus and club events, cultural activities,
              academic conferences, and more.
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                value={eventTypeFilter}
                onValueChange={(value: EventType) => setEventTypeFilter(value)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="campus">Campus Events</SelectItem>
                  <SelectItem value="club">Club Events</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={timeFilter}
                onValueChange={(value: "upcoming" | "past" | "all") =>
                  setTimeFilter(value)
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Time Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container mx-auto px-4 lg:px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg h-80 animate-pulse"
              >
                <div className="h-48 bg-gray-300 rounded-t-xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-500 mb-4">
              <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Failed to load events</p>
              <p className="text-sm">{error}</p>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No events found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredEvents.length} of {pagination?.count || 0}{" "}
                events
              </p>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <AnimatedSection key={event.uuid} delay={0.1 * (index % 6)}>
                  <Card className="h-full flex flex-col rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 overflow-hidden">
                    {/* Event Image */}
                    {event.thumbnail && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={event.thumbnail}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(
                              event
                            )}`}
                          >
                            {getEventTypeLabel(event)}
                          </span>
                        </div>
                      </div>
                    )}

                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {event.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="px-4 flex-grow">
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                          <span>{formatEventDate(event)}</span>
                        </div>

                        {event.source === "club" &&
                          (event as ClubEvent).clubName && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="h-4 w-4 mr-2 text-blue-600" />
                              <span>{(event as ClubEvent).clubName}</span>
                            </div>
                          )}
                      </div>

                      {event.descriptionShort && (
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          {event.descriptionShort}
                        </p>
                      )}
                    </CardContent>

                    <div className="p-4 pt-0">
                      <Button
                        asChild
                        variant="link"
                        className="text-blue-600 hover:text-blue-800 p-0 h-auto text-sm font-medium"
                      >
                        <Link
                          href={`/campus-life/${
                            event.source === "campus" ? "events" : "club-events"
                          }/${event.uuid}`}
                        >
                          View Details →
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </AnimatedSection>
              ))}
            </div>

            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}
