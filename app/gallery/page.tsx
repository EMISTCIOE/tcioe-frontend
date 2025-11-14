"use client";
import { AnimatedSection } from "@/components/animated-section";
import Image from "next/image";
import { useGlobalGallery } from "@/hooks/use-global-gallery";

export default function GalleryPage() {
  const { items, loading, error, refetch } = useGlobalGallery(60);

  if (loading) {
    return <div className="text-center py-20">Loading gallery...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500 space-y-4">
        <p>Error loading gallery: {error}</p>
        <button
          type="button"
          onClick={refetch}
          className="text-primary-blue underline text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <AnimatedSection className="py-20 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-primary-blue mb-12">
        Our Full Campus Gallery
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.uuid}
            className="relative w-full h-64 overflow-hidden rounded-xl shadow-lg"
          >
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.caption || item.sourceName}
              fill
              className="object-cover"
            />
            {(item.caption || item.sourceName) && (
              <div className="absolute inset-x-0 bottom-0 bg-black/50 p-3 text-white text-sm">
                {item.caption || item.sourceName}
                {item.sourceContext && (
                  <span className="block text-xs text-white/80">
                    {item.sourceContext}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
