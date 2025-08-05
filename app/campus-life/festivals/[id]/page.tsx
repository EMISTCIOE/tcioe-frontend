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

  // Extract text from HTML description
  const extractTextFromHtml = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
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
          <div className="text-red-600 text-lg mb-4">Error loading event</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 mr-4"
          >
            Try Again
          </button>
          <Link
            href="/campus-life/festivals"
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  if (!campusEvent) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-gray-600 text-lg mb-4">Event not found</div>
          <Link
            href="/campus-life/festivals"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Events
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
              src={campusEvent.thumbnail}
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
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {campusEvent.title}
            </h1>

            {/* Event Details */}
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2" />
                <span>
                  {formatEventDateRange(
                    campusEvent.eventStartDate,
                    campusEvent.eventEndDate
                  )}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Tag className="h-5 w-5 mr-2" />
                <span>{campusEvent.eventType} Event</span>
              </div>
            </div>

            {/* Short Description */}
            {campusEvent.descriptionShort && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {campusEvent.descriptionShort}
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

          {campusEvent.descriptionDetailed ? (
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{
                __html: campusEvent.descriptionDetailed,
              }}
            />
          ) : (
            <p className="text-gray-600">
              {campusEvent.descriptionShort ||
                "No detailed description available."}
            </p>
          )}
        </div>

        {/* Event Gallery */}
        {campusEvent.gallery && campusEvent.gallery.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Event Gallery
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campusEvent.gallery.map((galleryItem) => (
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
