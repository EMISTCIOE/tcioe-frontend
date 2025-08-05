"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedSection } from "@/components/animated-section";
import { CalendarDays, MapPin, Clock, Users } from "lucide-react";
import { useUpcomingEvents } from "@/hooks/use-upcoming-events";
import { Skeleton } from "@/components/ui/skeleton";

interface UpcomingEventsSectionProps {
  className?: string;
  showTitle?: boolean;
  limit?: number;
}

export const UpcomingEventsSection = ({
  className = "",
  showTitle = true,
  limit = 6,
}: UpcomingEventsSectionProps) => {
  const { events, loading, error } = useUpcomingEvents(limit);

  if (loading) {
    return (
      <section
        className={`py-12 md:py-20 bg-gradient-to-br from-white to-teal-light ${className}`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          {showTitle && (
            <AnimatedSection>
              <Skeleton className="h-8 w-64 mx-auto mb-10" />
            </AnimatedSection>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-full">
                <Skeleton className="h-64 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className={`py-12 md:py-20 bg-gradient-to-br from-white to-teal-light ${className}`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center text-red-500">
            <p>Failed to load upcoming events: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!events || events.length === 0) {
    return (
      <section
        className={`py-12 md:py-20 bg-gradient-to-br from-white to-teal-light ${className}`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          {showTitle && (
            <AnimatedSection>
              <h2 className="text-xl md:text-3xl font-bold text-center text-primary-blue mb-10">
                Upcoming Events
              </h2>
            </AnimatedSection>
          )}
          <div className="text-center text-gray-500">
            <p>No upcoming events found.</p>
          </div>
        </div>
      </section>
    );
  }

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays <= 7) return `In ${diffDays} days`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getEventTypeColor = (event: any) => {
    if (event.source === "campus") {
      switch (event.eventType) {
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

  const getEventTypeLabel = (event: any) => {
    if (event.source === "campus") {
      return (
        event.eventType?.charAt(0) + event.eventType?.slice(1).toLowerCase() ||
        "Campus Event"
      );
    } else {
      return "Club Event";
    }
  };

  return (
    <section
      className={`py-12 md:py-20 bg-gradient-to-br from-white to-teal-light ${className}`}
    >
      <div className="container mx-auto px-4 lg:px-6">
        {showTitle && (
          <AnimatedSection>
            <h2 className="text-xl md:text-3xl font-bold text-center text-primary-blue mb-10">
              Upcoming Events
            </h2>
          </AnimatedSection>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <AnimatedSection key={event.uuid} delay={0.1 * index}>
              <Card className="h-full flex flex-col rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 overflow-hidden">
                {/* Event Image */}
                {event.thumbnail && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.thumbnail}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
                  <CardTitle className="text-lg font-semibold text-text-dark line-clamp-2">
                    {event.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-4 flex-grow">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-text-light">
                      <CalendarDays className="h-4 w-4 mr-2 text-primary-blue" />
                      <span>{formatEventDate(event.displayDate)}</span>
                    </div>

                    {event.displayLocation && (
                      <div className="flex items-center text-sm text-text-light">
                        <MapPin className="h-4 w-4 mr-2 text-primary-blue" />
                        <span>{event.displayLocation}</span>
                      </div>
                    )}

                    {event.source === "club" && (event as any).clubName && (
                      <div className="flex items-center text-sm text-text-light">
                        <Users className="h-4 w-4 mr-2 text-primary-blue" />
                        <span>{(event as any).clubName}</span>
                      </div>
                    )}
                  </div>

                  {event.displayDescription && (
                    <p className="text-sm text-text-dark leading-relaxed line-clamp-3">
                      {event.displayDescription}
                    </p>
                  )}
                </CardContent>

                <div className="p-4 pt-0">
                  <Button
                    asChild
                    variant="link"
                    className="text-primary-blue hover:text-secondary-blue p-0 h-auto text-sm font-medium"
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

        {events.length > 0 && (
          <AnimatedSection delay={0.4} className="text-center mt-10">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-accent-orange hover:bg-accent-orange/90 text-white px-6 py-2 text-base rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Link href="/campus-life/club-events">View Club Events</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white px-6 py-2 text-base rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Link href="/events">View All Events</Link>
              </Button>
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
};
