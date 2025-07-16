"use client"

import Link from "next/link"
import type { Event } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"
import { CalendarDays, MapPin } from "lucide-react"

interface EventsHighlightsSectionProps {
  events: Event[]
}

export const EventsHighlightsSection = ({ events }: EventsHighlightsSectionProps) => {
  if (!events || events.length === 0) {
    return null
  }

  // Sort events by date to show upcoming ones first
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const upcomingEvents = sortedEvents.filter((event) => new Date(event.date) >= new Date()).slice(0, 3) // Show up to 3 upcoming events

  if (upcomingEvents.length === 0) {
    return null // Don't show section if no upcoming events
  }

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-white to-teal-light">
      <div className="container mx-auto px-4 lg:px-6">
        <AnimatedSection>
          <h2 className="text-xl md:text-3xl font-bold text-center text-primary-blue mb-10">Upcoming Events</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event, index) => (
            <AnimatedSection key={event.id} delay={0.1 * index}>
              <Card className="h-full flex flex-col rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 transform hover:-translate-y-0.5">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg font-semibold text-text-dark line-clamp-2">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-4 flex-grow">
                  <div className="flex items-center text-sm text-text-light mb-2">
                    <CalendarDays className="h-4 w-4 mr-2 text-primary-blue" />
                    <span>
                      {new Date(event.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-text-light mb-4">
                    <MapPin className="h-4 w-4 mr-2 text-primary-blue" />
                    <span>{event.location}</span>
                  </div>
                  <p className="text-sm text-text-dark leading-relaxed line-clamp-3">{event.description}</p>
                </CardContent>
                <div className="p-4 pt-0">
                  <Button
                    asChild
                    variant="link"
                    className="text-primary-blue hover:text-secondary-blue p-0 h-auto text-sm"
                  >
                    <Link href={`/events/${event.id}`}>View Details</Link>
                  </Button>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>
        <AnimatedSection delay={0.4} className="text-center mt-10">
          <Button
            asChild
            className="bg-accent-orange hover:bg-accent-orange/90 text-white px-6 py-2 text-base rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Link href="/events">View All Events</Link>
          </Button>
        </AnimatedSection>
      </div>
    </section>
  )
}
