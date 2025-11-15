"use client";
import { AnimatedSection } from "@/components/animated-section";
import Image from "next/image";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { GlobalGalleryItem } from "@/types";

export default function GalleryPage() {
  const [selectedSourceType, setSelectedSourceType] = useState("");
  const [items, setItems] = useState<GlobalGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ limit: "100" });

      if (selectedSourceType) {
        params.append("source_type", selectedSourceType);
      }

      const response = await fetch(`/api/global-gallery?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch gallery (${response.status})`);
      }
      const data = await response.json();
      setItems(data?.results ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [selectedSourceType]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  // Get unique source types from items for additional filtering
  const sourceTypes = useMemo(() => {
    const types = new Set(items.map((item) => item.sourceType));
    return Array.from(types).sort();
  }, [items]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-light to-wheat-light">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-lg text-text-dark">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-light to-wheat-light">
        <div className="text-center py-20 text-red-500 space-y-4">
          <p>Error loading gallery: {error}</p>
          <button
            type="button"
            onClick={fetchGallery}
            className="text-primary-blue underline text-sm hover:text-secondary-blue"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light to-wheat-light">
      {/* Hero Section */}
      <AnimatedSection className="relative bg-gradient-to-r from-primary-blue to-secondary-blue text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Campus Gallery
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
            Explore our vibrant campus life, events, and memorable moments
          </p>
        </div>
        <div className="absolute inset-0 bg-black/10"></div>
      </AnimatedSection>

      {/* Filters Section */}
      <AnimatedSection className="py-8 px-4 bg-white shadow-md" delay={0.1}>
        <div className="container mx-auto">
          <div className="flex flex-col space-y-4">
            {/* Source Type Filters */}
            {sourceTypes.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Filter by Source:
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => setSelectedSourceType("")}
                    variant={selectedSourceType === "" ? "default" : "outline"}
                    size="sm"
                    className={`rounded-full transition-all ${
                      selectedSourceType === ""
                        ? "bg-primary-blue text-white shadow-lg scale-105"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    All Sources
                  </Button>
                  {sourceTypes.map((type) => (
                    <Button
                      key={type}
                      onClick={() => setSelectedSourceType(type)}
                      variant={
                        selectedSourceType === type ? "default" : "outline"
                      }
                      size="sm"
                      className={`rounded-full transition-all ${
                        selectedSourceType === type
                          ? "bg-primary-blue text-white shadow-lg scale-105"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results count and reset */}
          <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
            <div className="text-sm text-gray-600">
              Showing {items.length} {items.length === 1 ? "photo" : "photos"}
            </div>
            {selectedSourceType && (
              <Button
                onClick={() => setSelectedSourceType("")}
                variant="ghost"
                size="sm"
                className="text-primary-blue hover:text-secondary-blue hover:underline"
              >
                Reset Filter
              </Button>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Gallery Grid */}
      <AnimatedSection className="py-12 px-4" delay={0.2}>
        <div className="container mx-auto">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <svg
                className="w-24 h-24 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-lg text-gray-500">
                No photos found for the selected filter
              </p>
              <button
                onClick={() => setSelectedSourceType("")}
                className="mt-4 text-primary-blue hover:text-secondary-blue underline"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item, index) => (
                <AnimatedSection key={item.uuid} delay={0.05 * (index % 12)}>
                  <div className="relative w-full h-64 overflow-hidden rounded-xl shadow-lg group hover:shadow-2xl transition-all duration-300">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.caption || item.sourceName}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                        {item.caption && (
                          <p className="font-semibold text-base mb-1">
                            {item.caption}
                          </p>
                        )}
                        <p className="text-sm opacity-90">{item.sourceName}</p>
                        {item.sourceContext && (
                          <p className="text-xs opacity-75 mt-1">
                            {item.sourceContext}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Source type badge */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.sourceType}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>
    </div>
  );
}
