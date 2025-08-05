"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Share2,
  ExternalLink,
  Users,
  Mail,
  Calendar,
  Globe,
  Star,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useClub, generateClubSubdomain } from "@/hooks/use-clubs";
import type { Club } from "@/types";

interface ClubDetailPageProps {
  params: Promise<{
    id: string; // Can be either club slug or UUID
  }>;
}

export default function ClubDetailPage({ params }: ClubDetailPageProps) {
  const resolvedParams = React.use(params);
  const { club, loading, error, refetch } = useClub({
    id: resolvedParams.id,
  });

  // Get club subdomain URL
  const clubSubdomain = club ? generateClubSubdomain(club.name) : null;

  // Handle contact button click
  const handleGetInTouch = () => {
    if (club?.website) {
      window.open(club.website, "_blank");
    } else if (clubSubdomain) {
      window.open(`https://${clubSubdomain}`, "_blank");
    } else {
      // Fallback to email or contact form
      window.location.href = "mailto:info@tcioe.edu.np";
    }
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: club?.name,
          text: club?.shortDescription,
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

  // Extract text from HTML description
  const extractTextFromHtml = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-red-600 text-lg mb-4">Error loading club</div>
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
            Back to Clubs
          </Link>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-gray-600 text-lg mb-4">Club not found</div>
          <Link
            href="/campus-life/clubs"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Clubs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Image with Overlay */}
        <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <Image
            src={club.thumbnail}
            alt={club.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

          {/* Navigation */}
          <div className="absolute top-6 left-6">
            <Link
              href="/campus-life/clubs"
              className="inline-flex items-center text-white/90 hover:text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Clubs
            </Link>
          </div>

          {/* Share Button */}
          <div className="absolute top-6 right-6">
            <button
              onClick={handleShare}
              className="p-3 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full text-white/90 hover:text-white transition-all"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Student Club
                </div>
                {club.members && club.members.length > 0 && (
                  <div className="ml-3 flex items-center text-white/80">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {club.members.length} member
                      {club.members.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
                {clubSubdomain && (
                  <div className="ml-3 flex items-center text-white/80">
                    <Globe className="h-4 w-4 mr-1" />
                    <span className="text-sm">{clubSubdomain}</span>
                  </div>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {club.name}
              </h1>

              <p className="text-xl text-white/90 leading-relaxed max-w-3xl">
                {club.shortDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative -mt-20 z-10">
        <div className="max-w-4xl mx-auto px-6">
          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Club Details */}
            {club.detailedDescription && (
              <div className="p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  About {club.name}
                </h2>

                <div
                  className="prose prose-lg prose-blue max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: club.detailedDescription,
                  }}
                />
              </div>
            )}

            {/* Members Section */}
            {club.members && club.members.length > 0 && (
              <div className="bg-gray-50 p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                  Club Members
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {club.members.map((member) => (
                    <div
                      key={member.uuid}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {member.image && (
                        <div className="relative w-16 h-16 mx-auto mb-4">
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover rounded-full"
                            sizes="64px"
                          />
                        </div>
                      )}

                      <div className="text-center">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {member.name}
                        </h3>
                        {member.position && (
                          <p className="text-sm text-blue-600 font-medium">
                            {member.position}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 md:p-12 text-white">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Interested in Joining?
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Become a part of {club.name} and contribute to our vibrant
                  community of learners and innovators.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleGetInTouch}
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center"
                  >
                    {club.website ? "Visit Website" : `Visit ${clubSubdomain}`}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </button>
                  <Link
                    href="/campus-life/clubs"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center"
                  >
                    Explore More Clubs
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Related Content */}
          <div className="mt-12 text-center pb-12">
            <Link
              href="/campus-life/clubs"
              className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
            >
              <Users className="h-5 w-5 mr-2" />
              Discover Other Student Clubs
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
