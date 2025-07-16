"use client";
import { AnimatedSection } from "@/components/animated-section";
import Image from "next/image";
import { useCollegeData } from "@/hooks/use-college-data";

export default function GalleryPage() {
  const { data, loading, error } = useCollegeData();

  if (loading)
    return <div className="text-center py-20">Loading gallery...</div>;
  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        Error loading gallery: {error}
      </div>
    );

  return (
    <AnimatedSection className="py-20 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-primary-blue mb-12">
        Our Full Campus Gallery
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.gallery.map((item) => (
          <div
            key={item.id}
            className="relative w-full h-64 overflow-hidden rounded-xl shadow-lg"
          >
            <Image
              src={item.src || "/placeholder.svg"}
              alt={item.alt}
              layout="fill"
              objectFit="cover"
            />
            {item.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-black/50 p-3 text-white text-sm">
                {item.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
