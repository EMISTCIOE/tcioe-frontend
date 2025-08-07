"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  ExternalLink,
  Users,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useEvent, formatEventDate } from "@/hooks/use-events";
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

  // Extract text from HTML description
  const extractTextFromHtml = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
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
          <div className="text-red-600 text-lg mb-4">Error loading event</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 mr-4"
          >
            Try Again
          </button>
          <Link
            href="/campus-life/clubs"
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
            href="/campus-life/clubs"
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
          href="/campus-life/clubs"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Club Events
        </Link>

        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {/* Hero Image */}
          <div className="relative h-64 md:h-80 bg-gray-200">
            <Image
              src={clubEvent.thumbnail}
              alt={clubEvent.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              priority
            />
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
                <span>{formatEventDate(clubEvent.date)}</span>
              </div>
            </div>

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

          {clubEvent.descriptionDetailed ? (
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{
                __html: clubEvent.descriptionDetailed,
              }}
            />
          ) : (
            <p className="text-gray-600">
              {clubEvent.descriptionShort ||
                "No detailed description available."}
            </p>
          )}
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            About {clubEvent.clubName}
          </h2>
          <div className="flex items-center text-gray-600">
            <Users className="h-5 w-5 mr-2" />
            <span>Student Club Event</span>
          </div>
          <p className="text-gray-600 mt-2">
            This event is organized by {clubEvent.clubName}, one of our active
            student organizations dedicated to providing enriching experiences
            for our campus community.
          </p>
        </div>

        {/* Related Events Link */}
        <div className="mt-8 text-center">
          <Link
            href="/campus-life/clubs"
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
