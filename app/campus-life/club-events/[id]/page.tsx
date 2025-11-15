"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  ExternalLink,
  Users,
  MapPin,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useEvent, formatEventDate } from "@/hooks/use-events";
import { useClub, generateClubSlug } from "@/hooks/use-clubs";
import type { ClubEvent } from "@/types";

interface ClubEventDetailPageProps {
  params: Promise<{
    id: string; // Can be either event slug or UUID
  }>;
}

export default function ClubEventDetailPage({
  params,
}: ClubEventDetailPageProps) {
  const resolvedParams = React.use(params);
  const { event, loading, error, refetch } = useEvent({
    id: resolvedParams.id,
    type: "club",
  });

  const clubEvent = event as ClubEvent;

  // Get club details if we have a club name from the event
  const clubNameForSearch =
    clubEvent?.clubName || clubEvent?.clubs?.[0]?.name || "";

  // Convert club name to slug for useClub hook
  const clubSlugForSearch = clubNameForSearch
    ? generateClubSlug(clubNameForSearch)
    : "";

  // Only fetch club details if we have a valid club name
  const shouldFetchClub = Boolean(
    clubSlugForSearch && clubSlugForSearch.trim()
  );
  const {
    club: clubDetails,
    loading: clubLoading,
    error: clubError,
  } = useClub({
    id: shouldFetchClub ? clubSlugForSearch : "",
  });

  // Debug logging
  React.useEffect(() => {
    if (clubEvent) {
      console.log("Club Event Data:", {
        clubName: clubEvent.clubName,
        clubSlugForSearch,
        registrationLink: clubEvent.registrationLink,
        clubs: clubEvent.clubs,
        location: clubEvent.location,
      });
    }
    if (clubDetails) {
      console.log("Club Details:", clubDetails);
    }
    if (clubError) {
      console.log("Club Error:", clubError);
    }
  }, [clubEvent, clubDetails, clubError, clubSlugForSearch]);

  // Extract text from HTML description
  const extractTextFromHtml = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  // Get the appropriate date for display - try multiple sources
  const getEventDate = () => {
    // Try different date fields that might be available
    return clubEvent?.eventStartDate || clubEvent?.date || null;
  };

  // Get event end date if available
  const getEventEndDate = () => {
    return clubEvent?.eventEndDate || null;
  };

  // Format date range if both start and end dates are available
  const formatEventDateDisplay = () => {
    const startDate = getEventDate();
    const endDate = getEventEndDate();

    if (!startDate) return "Date TBA";

    if (endDate && endDate !== startDate) {
      return `${formatEventDate(startDate)} - ${formatEventDate(endDate)}`;
    }

    return formatEventDate(startDate);
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: clubEvent?.title,
          text: clubEvent?.descriptionShort,
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

  if (loading || (clubLoading && shouldFetchClub)) {
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
          <div className="text-red-600 text-lg mb-4">Error loading event</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 mr-4"
          >
            Try Again
          </button>
          <Link
            href="/campus-life/club-events"
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Club Events
          </Link>
        </div>
      </div>
    );
  }

  if (!clubEvent) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-gray-600 text-lg mb-4">Event not found</div>
          <Link
            href="/campus-life/club-events"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Club Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/campus-life/club-events"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Club Events
        </Link>

        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {/* Hero Image */}
          <div className="relative h-64 md:h-80 bg-gray-200">
            {clubEvent.thumbnail ? (
              <Image
                src={clubEvent.thumbnail}
                alt={clubEvent.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-300">
                <div className="text-gray-500 text-lg">No Image Available</div>
              </div>
            )}
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
          <div className="p-6">
            {/* Club Name */}
            <div className="flex items-center text-blue-600 mb-3">
              <Users className="h-5 w-5 mr-2" />
              <span className="font-medium">{clubEvent.clubName}</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {clubEvent.title}
            </h1>

            {/* Event Details */}
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{formatEventDateDisplay()}</span>
              </div>
              {clubEvent.location && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{clubEvent.location}</span>
                </div>
              )}
            </div>

            {/* Registration Link */}
            {clubEvent.registrationLink && (
              <div className="mb-6">
                <a
                  href={clubEvent.registrationLink}
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
            {clubEvent.descriptionShort && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {clubEvent.descriptionShort}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Event Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Event Details
          </h2>

          {/* Event Type Badge */}
          {clubEvent.eventType && (
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {clubEvent.eventType.charAt(0) +
                  clubEvent.eventType.slice(1).toLowerCase()}{" "}
                Event
              </span>
            </div>
          )}

          {/* Event Description */}
          {clubEvent.descriptionDetailed ? (
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{
                __html: clubEvent.descriptionDetailed,
              }}
            />
          ) : clubEvent.description ? (
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{
                __html: clubEvent.description,
              }}
            />
          ) : clubEvent.descriptionShort ? (
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {clubEvent.descriptionShort}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-16 w-16 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Event Details Coming Soon
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We're still preparing the detailed information for this event.
                Please check back later or contact the organizing club for more
                information.
              </p>
              {clubEvent.registrationLink && (
                <div className="mt-6">
                  <a
                    href={clubEvent.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Event Page
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* About Club/Organizer Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            About{" "}
            {clubEvent.clubs && clubEvent.clubs.length > 0
              ? clubEvent.clubs[0].name
              : clubEvent.clubName || "Organizer"}
          </h2>

          <div className="flex items-start space-x-3 mb-4">
            <div className="flex flex-col md:flex-row gap-6 w-full">
              {/* Club Logo */}
              {clubDetails?.thumbnail && (
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-lg overflow-hidden bg-gray-100 border">
                    <Image
                      src={clubDetails.thumbnail}
                      alt={`${clubEvent.clubName} logo`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 96px, 128px"
                    />
                  </div>
                </div>
              )}
              {/* Club Content */}
              <div className="flex-1">
                <p className="text-gray-700 mb-4">
                  This event is organized by{" "}
                  <strong>
                    {clubEvent.clubs && clubEvent.clubs.length > 0
                      ? clubEvent.clubs[0].name
                      : clubEvent.clubName || "our organization"}
                  </strong>
                  , one of our active student organizations dedicated to
                  providing enriching experiences for our campus community.
                </p>

                {/* Link to club detail page */}
                <div className="mt-4">
                  {clubEvent.clubs && clubEvent.clubs.length > 0 ? (
                    <Link
                      href={`/campus-life/clubs/${clubEvent.clubs[0].name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Learn more about {clubEvent.clubs[0].name}
                    </Link>
                  ) : clubDetails ? (
                    <Link
                      href={`/campus-life/clubs/${
                        clubDetails.slug ||
                        clubDetails.name.toLowerCase().replace(/\s+/g, "-")
                      }`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Learn more about {clubDetails.name}
                    </Link>
                  ) : (
                    <Link
                      href="/campus-life/clubs"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      View All Clubs
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Gallery */}
        {clubEvent.gallery && clubEvent.gallery.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Event Gallery
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clubEvent.gallery.map((galleryItem) => (
                <div
                  key={galleryItem.uuid}
                  className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden"
                >
                  <Image
                    src={galleryItem.image}
                    alt={galleryItem.caption}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {galleryItem.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">
                      <p className="text-sm">{galleryItem.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Club Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Action Links */}
          <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-200">
            {clubEvent.registrationLink && (
              <a
                href={clubEvent.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Register for Event
              </a>
            )}
            {clubDetails?.websiteUrl && (
              <a
                href={clubDetails.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Club Website
              </a>
            )}
            <Link
              href="/campus-life/clubs"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium"
            >
              <Users className="h-4 w-4 mr-2" />
              View All Clubs
            </Link>
          </div>
        </div>

        {/* Related Events Link */}
        <div className="mt-8 text-center">
          <Link
            href="/campus-life/club-events"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            View More Club Events
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
