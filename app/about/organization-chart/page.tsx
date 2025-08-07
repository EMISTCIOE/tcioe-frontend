"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, ZoomIn, ZoomOut, RotateCw, Maximize2 } from "lucide-react";
import { AnimatedSection } from "@/components/animated-section";
import { SocialLinks } from "@/components/social-links";
import { useCampusInfo } from "@/hooks/use-campus-info";

export default function OrganizationChartPage() {
  const { campusInfo, loading, error, refetch } = useCampusInfo();
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDownload = async () => {
    if (!campusInfo?.organizationChart) return;

    try {
      const response = await fetch(campusInfo.organizationChart);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "organization-chart.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading chart:", error);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (loading) {
    return (
      <AnimatedSection className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">
              Organization Chart
            </h1>
            <p className="text-lg text-gray-600">
              Loading campus organization structure...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  if (error) {
    return (
      <AnimatedSection className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Organization Chart
          </h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <p className="text-red-600 mb-4">
              Error loading organization chart
            </p>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => refetch()}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  if (!campusInfo?.organizationChart) {
    return (
      <AnimatedSection className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Organization Chart
          </h1>
          <p className="text-lg text-gray-600">
            Organization chart not available at the moment.
          </p>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <>
      <AnimatedSection className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">
              Organization Chart
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Administrative structure of {campusInfo.name}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isZoomed ? (
                  <ZoomOut className="h-4 w-4 mr-2" />
                ) : (
                  <ZoomIn className="h-4 w-4 mr-2" />
                )}
                {isZoomed ? "Zoom Out" : "Zoom In"}
              </button>

              <button
                onClick={toggleFullscreen}
                className="inline-flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                Fullscreen
              </button>

              <button
                onClick={handleDownload}
                className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            </div>
          </div>

          {/* Organization Chart */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div
              className={`relative ${
                isZoomed ? "overflow-auto" : "overflow-hidden"
              }`}
            >
              <div
                className={`transition-transform duration-300 ${
                  isZoomed ? "scale-150 origin-top-left" : "scale-100"
                }`}
              >
                <Image
                  src={campusInfo.organizationChart}
                  alt="Organization Chart - Administrative Structure"
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Campus Contact Info */}
          <div className="mt-12 bg-blue-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                <p className="text-gray-600">{campusInfo.location}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600">{campusInfo.phoneNumber}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">{campusInfo.email}</p>
              </div>
            </div>

            {/* Social Links */}
            {campusInfo.socialLinks && campusInfo.socialLinks.length > 0 && (
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Connect With Us
                </h3>
                <SocialLinks
                  socialLinks={campusInfo.socialLinks}
                  className="justify-center"
                />
              </div>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-7xl max-h-full">
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-10 bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              ✕
            </button>
            <div className="w-full h-full overflow-auto">
              <Image
                src={campusInfo.organizationChart}
                alt="Organization Chart - Administrative Structure (Fullscreen)"
                width={1200}
                height={800}
                className="w-full h-auto"
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
