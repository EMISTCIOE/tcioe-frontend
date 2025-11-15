"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Share2,
  Download,
  ExternalLink,
  Tag,
  Users,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useEvent, formatEventDateRange } from "@/hooks/use-events";
import { useFilteredGlobalGallery } from "@/hooks/use-filtered-global-gallery";
import type { CampusEvent } from "@/types";

interface CampusEventDetailPageProps {
  params: Promise<{
    id: string; // Can be either event slug or UUID
  }>;
}

export default function CampusEventDetailPage({
  params,
}: CampusEventDetailPageProps) {
  const resolvedParams = React.use(params);
  const { event, loading, error, refetch } = useEvent({
    id: resolvedParams.id,
    type: "campus",
  });

  const campusEvent = event as CampusEvent;

  // Fetch global gallery images as fallback
  const {
    items: globalGalleryItems,
    loading: galleryLoading,
    error: galleryError,
  } = useFilteredGlobalGallery({
    sourceType: "global_event",
    sourceIdentifier: campusEvent?.uuid,
    limit: 12,
  });

  // Extract text from HTML description
  const extractTextFromHtml = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  // Get the appropriate date for display
  const getEventDate = () => {
    return campusEvent?.eventStartDate || null;
  };

  // Get event end date if available
  const getEventEndDate = () => {
    return campusEvent?.eventEndDate || null;
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

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: campusEvent?.title,
          text: campusEvent?.descriptionShort,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-red-600 text-lg mb-4">Event Not Found</div>
          <p className="text-gray-600 mb-6">
            Sorry, we couldn't find this event. It might have been removed or
            the link may be incorrect.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => refetch()}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/campus-life/festivals"
              className="inline-block bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Browse All Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!campusEvent) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-gray-600 text-lg mb-4">Event not found</div>
          <p className="text-gray-500 mb-6">
            This event may no longer be available.
          </p>
          <Link
            href="/campus-life/festivals"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse All Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/campus-life/festivals"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campus Events
        </Link>

        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {/* Hero Image */}
          <div className="relative h-64 md:h-80 bg-gray-200">
            <Image
              src={campusEvent.thumbnail || "/logo.jpg"}
              alt={campusEvent.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              priority
            />
            {/* Event Type Badge */}
            <div className="absolute top-4 left-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(
                  campusEvent.eventType
                )}`}
              >
                {campusEvent.eventType}
              </span>
            </div>
            {/* Share Button */}
            <div className="absolute top-4 right-4">
              <button
                onClick={handleShare}
                className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                <Share2 className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Event Info */}
          <div className="p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 break-words">
              {campusEvent.title}
            </h1>

            {/* Event Details */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="break-words">
                  {formatEventDateRange(
                    campusEvent.eventStartDate,
                    campusEvent.eventEndDate
                  )}
                </span>
              </div>
              {campusEvent.location && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="break-words">{campusEvent.location}</span>
                </div>
              )}
              <div className="flex items-center text-gray-600">
                <Tag className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="break-words">
                  {campusEvent.eventType} Event
                </span>
              </div>
            </div>

            {/* Registration Link */}
            {campusEvent.registrationLink && (
              <div className="mb-6">
                <a
                  href={campusEvent.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Register for Event
                </a>
              </div>
            )}

            {/* Short Description */}
            {campusEvent.descriptionShort && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p
                  className="text-gray-700 leading-relaxed break-words"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {campusEvent.descriptionShort}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Event Content */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
            Event Details
          </h2>

          {campusEvent.description ? (
            <div
              className="prose prose-gray max-w-none break-words overflow-hidden"
              style={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
                hyphens: "auto",
              }}
              dangerouslySetInnerHTML={{
                __html: campusEvent.description,
              }}
            />
          ) : campusEvent.descriptionDetailed ? (
            <div
              className="prose prose-gray max-w-none break-words overflow-hidden"
              style={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
                hyphens: "auto",
              }}
              dangerouslySetInnerHTML={{
                __html: campusEvent.descriptionDetailed,
              }}
            />
          ) : (
            <p
              className="text-gray-600 break-words"
              style={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {campusEvent.descriptionShort ||
                "No detailed description available."}
            </p>
          )}
        </div>

        {/* Event Organizer Information */}
        {(campusEvent.union ||
          (campusEvent as any).clubs?.length > 0 ||
          (campusEvent as any).departments?.length > 0) && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 break-words">
              About{" "}
              {campusEvent.union
                ? campusEvent.union.name
                : (campusEvent as any).clubs?.length > 0
                ? (campusEvent as any).clubs[0].name
                : (campusEvent as any).departments?.length > 0
                ? (campusEvent as any).departments[0].name
                : "Organizer"}
            </h2>

            <div className="flex items-start space-x-3 mb-4">
              <Users className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600 mb-2">
                  {campusEvent.union
                    ? "Union Event"
                    : (campusEvent as any).clubs?.length > 0
                    ? "Student Club Event"
                    : "Department Event"}
                </p>
                <p
                  className="text-gray-700 mb-4 break-words"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  This event is organized by{" "}
                  <strong className="break-words">
                    {campusEvent.union
                      ? campusEvent.union.name
                      : (campusEvent as any).clubs?.length > 0
                      ? (campusEvent as any).clubs[0].name
                      : (campusEvent as any).departments?.length > 0
                      ? (campusEvent as any).departments[0].name
                      : "our organization"}
                  </strong>
                  , one of our active{" "}
                  {campusEvent.union
                    ? "student unions"
                    : (campusEvent as any).clubs?.length > 0
                    ? "student organizations"
                    : "academic departments"}{" "}
                  dedicated to providing enriching experiences for our campus
                  community.
                </p>

                {/* Link to organizer detail page */}
                <div className="mt-4">
                  {campusEvent.union && (
                    <Link
                      href={`/campus-life/unions/${campusEvent.union.uuid}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Learn more about {campusEvent.union.name}
                    </Link>
                  )}
                  {(campusEvent as any).clubs?.length > 0 && (
                    <Link
                      href={`/campus-life/clubs/${(
                        campusEvent as any
                      ).clubs[0].name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Learn more about {(campusEvent as any).clubs[0].name}
                    </Link>
                  )}
                  {(campusEvent as any).departments?.length > 0 && (
                    <Link
                      href={`/departments/${
                        (campusEvent as any).departments[0].uuid
                      }`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Learn more about{" "}
                      {(campusEvent as any).departments[0].name}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Event Gallery */}
        {((campusEvent.gallery && campusEvent.gallery.length > 0) ||
          (globalGalleryItems && globalGalleryItems.length > 0)) && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
              Event Gallery
            </h2>

            {galleryLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {/* Display direct event gallery first */}
                {campusEvent.gallery?.map((galleryItem) => (
                  <div
                    key={`direct-${galleryItem.uuid}`}
                    className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={galleryItem.image}
                      alt={galleryItem.caption || campusEvent.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {galleryItem.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">
                        <p className="text-xs sm:text-sm break-words">
                          {galleryItem.caption}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {/* Display global gallery items as fallback */}
                {(!campusEvent.gallery || campusEvent.gallery.length === 0) &&
                  globalGalleryItems?.map((galleryItem) => (
                    <div
                      key={`global-${galleryItem.uuid}`}
                      className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={galleryItem.image}
                        alt={galleryItem.caption || campusEvent.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {galleryItem.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">
                          <p className="text-xs sm:text-sm break-words">
                            {galleryItem.caption}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Related Events Link */}
        <div className="mt-8 text-center">
          <Link
            href="/campus-life/festivals"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            View More Campus Events
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
