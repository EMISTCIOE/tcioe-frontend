"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { AnimatedSection } from "@/components/animated-section";
import { useResearchFacilityDetail } from "@/hooks/use-research-facility";

interface ResearchFacilityDetailProps {
  slug: string;
}

export function ResearchFacilityDetailView({
  slug,
}: ResearchFacilityDetailProps) {
  const { data, loading, error, refetch } = useResearchFacilityDetail(slug);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-blue/30 border-t-primary-blue"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <p className="text-lg font-semibold text-primary-blue mb-2">
          Unable to load facility details.
        </p>
        {error && <p className="text-sm text-gray-600 mb-4">{error}</p>}
        <button
          type="button"
          onClick={refetch}
          className="inline-flex items-center gap-2 rounded-full bg-primary-blue px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary-blue/90"
        >
          <RefreshCcw className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-3 text-sm text-primary-blue">
        <ArrowLeft className="h-4 w-4" />
        <Link href="/research/facilities" className="hover:underline">
          Back to Research Facilities
        </Link>
      </div>

      <AnimatedSection className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        {data.thumbnail && (
          <div className="relative h-64 w-full overflow-hidden">
            <Image
              src={data.thumbnail}
              alt={data.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-sm uppercase tracking-wide">
                Research Facility
              </p>
              <h1 className="text-3xl font-bold">{data.name}</h1>
              <p className="text-sm text-white/80 max-w-3xl">
                Explore how this facility fuels research, experimentation, and
                innovation at Thapathali Campus.
              </p>
            </div>
          </div>
        )}
        {!data.thumbnail && (
          <div className="p-8">
            <p className="text-sm uppercase tracking-wide text-primary-blue">
              Research Facility
            </p>
            <h1 className="text-3xl font-bold text-primary-blue">
              {data.name}
            </h1>
            <p className="mt-3 text-gray-600">
              Explore how this facility fuels research, experimentation, and
              innovation at Thapathali Campus.
            </p>
          </div>
        )}
      </AnimatedSection>

      {data.short_description && (
        <AnimatedSection className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-primary-blue mb-4">Overview</h2>
          <p className="text-gray-700 leading-relaxed">
            {data.short_description}
          </p>
        </AnimatedSection>
      )}

      {data.detailed_description && (
        <AnimatedSection className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-primary-blue mb-4">
            About this facility
          </h2>
          <div
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{
              __html: data.detailed_description,
            }}
          />
        </AnimatedSection>
      )}

      {data.objectives && (
        <AnimatedSection className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-primary-blue mb-4">
            Objectives
          </h2>
          <div
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{
              __html: data.objectives,
            }}
          />
        </AnimatedSection>
      )}
    </div>
  );
}
