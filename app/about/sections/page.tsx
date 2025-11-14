"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatedSection } from "@/components/animated-section";
import { useCampusDivisions } from "@/hooks/use-campus-divisions";
import { stripHtmlTags } from "@/lib/utils";

export default function CampusSectionsPage() {
  const { items, loading, error, refetch } = useCampusDivisions("sections", {
    limit: 50,
    ordering: "display_order",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        <AnimatedSection className="text-center space-y-3">
          <p className="text-sm uppercase tracking-wide text-primary-blue">
            Campus Sections
          </p>
          <h1 className="text-4xl font-bold text-primary-blue">
            Administrative & Academic Sections
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the sections that keep Thapathali Campus running—from
            financial administration to planning, facilities, and academic
            services.
          </p>
        </AnimatedSection>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-blue/30 border-t-primary-blue"></div>
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-lg font-semibold text-red-700">
              Unable to load sections
            </p>
            <p className="text-sm text-red-600">
              We're having trouble loading the sections right now. Please try again shortly.
            </p>
            <button
              type="button"
              onClick={refetch}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-blue px-4 py-2 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-gray-800">
              Sections are being updated.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Please check back soon for detailed information.
            </p>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <AnimatedSection className="grid gap-6 md:grid-cols-2">
            {items.map((section) => (
              <article
                key={section.uuid}
                className="flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {section.thumbnail && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={section.thumbnail}
                      alt={section.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs uppercase tracking-wide text-primary-blue">
                    Section #{section.displayOrder}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-primary-blue">
                    {section.name}
                  </h3>
                  <p className="mt-3 flex-1 text-sm text-gray-600">
                    {stripHtmlTags(section.shortDescription)}
                  </p>
                  <Link
                    href={`/about/sections/${section.slug}`}
                    className="mt-4 inline-flex items-center text-sm font-semibold text-primary-blue hover:underline"
                  >
                    Explore section details →
                  </Link>
                </div>
              </article>
            ))}
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
