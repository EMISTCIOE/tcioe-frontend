"use client";
import { AnimatedSection } from "@/components/animated-section";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import type { GlobalGalleryItem } from "@/types";

const SOURCE_LABELS: Record<string, string> = {
  college: "Campus",
  department: "Departments",
  events: "Events",
  event: "Events",
  club: "Clubs",
  clubs: "Clubs",
};

const formatSourceLabel = (value: string) => {
  const safe = value?.toLowerCase();
  if (!safe) return "";
  if (SOURCE_LABELS[safe]) {
    return SOURCE_LABELS[safe];
  }

  return safe
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function GalleryPage() {
  const [selectedSourceType, setSelectedSourceType] = useState("");
  const [selectedItem, setSelectedItem] = useState<GlobalGalleryItem | null>(
    null
  );
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [lightboxSize, setLightboxSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["global-gallery", selectedSourceType],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({ limit: "100" });

      if (selectedSourceType) {
        params.append("source_type", selectedSourceType);
      }

      const response = await fetch(`/api/global-gallery?${params.toString()}`, {
        signal,
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch gallery (${response.status})`);
      }
      return response.json() as Promise<{ results: GlobalGalleryItem[] }>;
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 2,
  });

  const items = data?.results ?? [];

  // Get unique source types from items for additional filtering
  const sourceTypes = useMemo(() => {
    const types = new Set(items.map((item) => item.sourceType));
    return Array.from(types).sort();
  }, [items]);

  const hasFilters = sourceTypes.length > 0;
  const filterChips = hasFilters
    ? sourceTypes.map((type) => ({
        value: type,
        label: formatSourceLabel(type),
      }))
    : [];

  useEffect(() => {
    const updateViewport = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    setLightboxSize(null);
  }, [selectedItem]);

  const lightboxStyle = useMemo(() => {
    const fallbackWidth =
      viewportSize.width > 0 ? Math.min(viewportSize.width * 0.8, 900) : 800;
    const fallbackHeight =
      viewportSize.height > 0 ? Math.min(viewportSize.height * 0.7, 700) : 600;

    if (!lightboxSize) {
      return { width: fallbackWidth, height: fallbackHeight };
    }

    const maxWidth =
      viewportSize.width > 0 ? viewportSize.width * 0.9 : lightboxSize.width;
    const maxHeight =
      viewportSize.height > 0
        ? viewportSize.height * 0.85
        : lightboxSize.height;
    const scale = Math.min(
      maxWidth / lightboxSize.width,
      maxHeight / lightboxSize.height,
      1
    );

    return {
      width: lightboxSize.width * scale,
      height: lightboxSize.height * scale,
    };
  }, [lightboxSize, viewportSize.height, viewportSize.width]);

  useEffect(() => {
    const updateViewport = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    setLightboxSize(null);
  }, [selectedItem]);

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-light to-wheat-light">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-lg text-text-dark">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    const message =
      error instanceof Error ? error.message : "Unexpected error occurred";
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-light to-wheat-light">
        <div className="text-center py-20 text-red-500 space-y-4">
          <p>Error loading gallery: {message}</p>
          <button
            type="button"
            onClick={() => refetch()}
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
      <AnimatedSection className="relative overflow-hidden bg-gradient-to-br from-primary-blue to-secondary-blue text-white py-12 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_55%)]" />
        <div className="container relative mx-auto flex flex-col items-center text-center gap-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">
            Campus Gallery
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight text-balance">
            Explore life around Thapathali Engineering Campus
          </h1>
          <p className="text-base md:text-lg max-w-3xl mx-auto text-white/90">
            Curated glimpses of classrooms, labs, events, and the people who
            make this community memorable.
          </p>
        </div>
      </AnimatedSection>

      {/* Filters Section */}
      <AnimatedSection className="py-8 px-4" delay={0.1}>
        <div className="container mx-auto">
          {hasFilters ? (
            <div className="rounded-3xl border border-black/5 bg-white/95 px-5 py-6 shadow-lg shadow-primary-blue/10 backdrop-blur">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedSourceType("")}
                  aria-pressed={selectedSourceType === ""}
                  className={`rounded-full border px-5 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                    selectedSourceType === ""
                      ? "border-primary-blue bg-primary-blue text-white shadow-md"
                      : "border-gray-200 text-gray-700 hover:border-primary-blue/40 hover:text-primary-blue"
                  }`}
                >
                  All
                </button>
                {filterChips.map((chip) => (
                  <button
                    key={chip.value}
                    type="button"
                    onClick={() => setSelectedSourceType(chip.value)}
                    aria-pressed={selectedSourceType === chip.value}
                    className={`rounded-full border px-5 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                      selectedSourceType === chip.value
                        ? "border-primary-blue bg-primary-blue text-white shadow-md"
                        : "border-gray-200 text-gray-700 hover:border-primary-blue/40 hover:text-primary-blue"
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white/80 px-6 py-8 text-center text-sm text-gray-500">
              Currently showcasing campus-wide photos. More categories will
              appear as fresh collections come in.
            </div>
          )}
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
                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="group relative block w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2"
                  >
                    <div className="relative h-64 w-full">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.caption || item.sourceName}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-left text-white">
                        {item.caption && (
                          <p className="text-base font-semibold">
                            {item.caption}
                          </p>
                        )}
                        <p className="text-sm text-white/80">
                          {item.sourceName}
                        </p>
                        {item.sourceContext && (
                          <p className="text-xs text-white/70 mt-1">
                            {item.sourceContext}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>

      <Dialog
        open={Boolean(selectedItem)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedItem(null);
            setLightboxSize(null);
          }
        }}
      >
        <DialogContent className="w-[96vw] max-w-6xl border-none bg-transparent p-0 shadow-none">
          {selectedItem && (
            <div
              className="relative mx-auto overflow-hidden rounded-[32px] bg-white/95 p-2 shadow-2xl"
              style={{
                ...lightboxStyle,
                maxWidth: "90vw",
                maxHeight: "85vh",
              }}
            >
              <Image
                src={selectedItem.image || "/placeholder.svg"}
                alt={selectedItem.caption || selectedItem.sourceName}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 75vw"
                priority
                onLoadingComplete={({ naturalWidth, naturalHeight }) => {
                  setLightboxSize((prev) => {
                    if (
                      prev &&
                      prev.width === naturalWidth &&
                      prev.height === naturalHeight
                    ) {
                      return prev;
                    }
                    return { width: naturalWidth, height: naturalHeight };
                  });
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
