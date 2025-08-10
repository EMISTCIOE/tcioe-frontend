"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Share2, Users, Mail, Calendar } from "lucide-react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useUnion, generateUnionSlug } from "@/hooks/use-unions";
import type { Union } from "@/types";

interface UnionDetailPageProps {
  params: Promise<{
    id: string; // Can be either union slug or UUID
  }>;
}

export default function UnionDetailPage({ params }: UnionDetailPageProps) {
  const resolvedParams = React.use(params);
  const { union, loading, error, refetch } = useUnion({
    id: resolvedParams.id,
  });

  // Handle contact button click
  const handleGetInTouch = () => {
    if (union?.websiteUrl) {
      window.open(union.websiteUrl, "_blank");
    } else {
      // Fallback to general contact
      window.location.href = "mailto:info@tcioe.edu.np";
    }
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: union?.name,
          text: union?.shortDescription,
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
          <div className="text-red-600 text-lg mb-4">Error loading union</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 mr-4"
          >
            Try Again
          </button>
          <Link
            href="/campus-life/unions"
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Unions
          </Link>
        </div>
      </div>
    );
  }

  if (!union) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-gray-600 text-lg mb-4">Union not found</div>
          <Link
            href="/campus-life/unions"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Unions
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
            src={union.thumbnail}
            alt={union.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

          {/* Navigation */}
          <div className="absolute top-6 left-6">
            <Link
              href="/campus-life/unions"
              className="inline-flex items-center text-white/90 hover:text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Unions
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
                  Student Union
                </div>
                {union.members && union.members.length > 0 && (
                  <div className="ml-3 flex items-center text-white/80">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {union.members.length} member
                      {union.members.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {union.name}
              </h1>

              <p className="text-xl text-white/90 leading-relaxed max-w-3xl">
                {union.shortDescription}
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
            {/* Union Details */}
            {/* Union Details */}
            <div className="p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                About {union.name}
              </h2>

              {union.detailedDescription ? (
                <div
                  className="prose prose-lg prose-blue max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: union.detailedDescription,
                  }}
                />
              ) : (
                <div className="prose prose-lg prose-blue max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {union.shortDescription}
                  </p>

                  <div className="mt-6 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      Get Involved
                    </h3>
                    <p className="text-blue-800">
                      {union.name} represents and serves our student community.
                      For more information about joining or participating in
                      union activities, please contact our student affairs
                      office.
                    </p>
                  </div>
                </div>
              )}
            </div>
            {/* Members Section */}
            {union.members && union.members.length > 0 && (
              <div className="bg-gray-50 p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                  Union Members
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {union.members.map((member) => (
                    <div
                      key={member.uuid}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {member.photo && (
                        <div className="relative w-16 h-16 mx-auto mb-4">
                          <Image
                            src={member.photo}
                            alt={member.fullName}
                            fill
                            className="object-cover rounded-full"
                            sizes="64px"
                          />
                        </div>
                      )}

                      <div className="text-center">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {member.fullName}
                        </h3>
                        {member.designation && (
                          <p className="text-sm text-blue-600 font-medium">
                            {member.designation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}{" "}
            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 md:p-12 text-white">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Want to Learn More?
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Get in touch with {union.name} to learn about membership,
                  activities, and how you can get involved.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleGetInTouch}
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center"
                  >
                    {union.websiteUrl ? (
                      <>
                        <Users className="mr-2 h-4 w-4" />
                        Visit Website
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Get in Touch
                      </>
                    )}
                  </button>
                  <Link
                    href="/campus-life/unions"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center"
                  >
                    Explore Other Unions
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Related Content */}
          <div className="mt-12 text-center pb-12">
            <Link
              href="/campus-life/unions"
              className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
            >
              <Users className="h-5 w-5 mr-2" />
              Discover Other Student Unions
              <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
