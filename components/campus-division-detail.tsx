"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, RefreshCcw, Users } from "lucide-react";
import { AnimatedSection } from "@/components/animated-section";
import { useCampusDivisionDetail } from "@/hooks/use-campus-divisions";
import { stripHtmlTags } from "@/lib/utils";

// Helper function to decode HTML entities
function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

interface CampusDivisionDetailProps {
  slug: string;
  kind: "sections" | "units" | "research-facilities";
}

const KIND_COPY = {
  sections: {
    title: "Campus Section",
    baseHref: "/about/sections",
    description:
      "Explore the responsibilities, goals, and team members who lead this section.",
    headTitle: "Section Head",
  },
  units: {
    title: "Campus Unit",
    baseHref: "/about/units",
    description:
      "Learn more about this unit's mission, services, and dedicated officers.",
    headTitle: "Unit Head",
  },
  "research-facilities": {
    title: "Research Facility",
    baseHref: "/research/facilities",
    description:
      "Explore how this facility fuels research, experimentation, and innovation at Thapathali Campus.",
    headTitle: "Facility Lead",
  },
};

export function CampusDivisionDetailView({
  slug,
  kind,
}: CampusDivisionDetailProps) {
  const { data, loading, error, refetch } = useCampusDivisionDetail(kind, slug);
  const copy = KIND_COPY[kind];
  const departmentHead = data?.departmentHead;
  const memberOfficials =
    data?.officials?.filter(
      (official) => !departmentHead || official.uuid !== departmentHead.uuid
    ) ?? [];

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
          Unable to load details.
        </p>
        <p className="text-sm text-gray-600 mb-4">
          We're having trouble fetching the details right now. Please try again shortly.
        </p>
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
        <Link href={copy.baseHref} className="hover:underline">
          Back to {copy.title}s
        </Link>
      </div>

      <AnimatedSection className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        {data.heroImage && (
          <div className="relative h-64 w-full overflow-hidden">
            <Image
              src={data.heroImage}
              alt={data.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-sm uppercase tracking-wide">{copy.title}</p>
              <h1 className="text-3xl font-bold">{data.name}</h1>
              <p className="text-sm text-white/80 max-w-3xl">
                {copy.description}
              </p>
            </div>
          </div>
        )}
        {!data.heroImage && (
          <div className="p-8">
            <p className="text-sm uppercase tracking-wide text-primary-blue">
              {copy.title}
            </p>
            <h1 className="text-3xl font-bold text-primary-blue">
              {data.name}
            </h1>
            <p className="mt-3 text-gray-600">{copy.description}</p>
          </div>
        )}

        <div className="grid gap-6 border-t border-gray-100 p-6 md:grid-cols-2">
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5 shadow-sm border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Mail className="h-5 w-5 text-primary-blue" />
              </div>
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-600">
                Email Contact
              </p>
            </div>
            <p className="text-sm text-gray-800 font-medium">
              {data.contactEmail || "Not provided"}
            </p>
          </div>
          {data.contactPhone && (
            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-5 shadow-sm border border-purple-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Phone className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-xs uppercase tracking-wider font-semibold text-gray-600">
                  Phone Contact
                </p>
              </div>
              <p className="text-sm text-gray-800 font-medium">
                {data.contactPhone}
              </p>
            </div>
          )}
        </div>
      </AnimatedSection>

      <AnimatedSection className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-blue-50/30 p-8 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-1 w-12 bg-gradient-to-r from-primary-blue to-purple-600 rounded-full"></div>
          <h2 className="text-3xl font-bold text-primary-blue">
            About this {copy.title.toLowerCase()}
          </h2>
        </div>
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed text-lg text-justify">
            {stripHtmlTags(data.shortDescription)}
          </p>
          {data.detailedDescription && (
            <div
              className="prose prose-lg prose-indigo mt-6 max-w-none text-gray-700 prose-headings:text-primary-blue prose-a:text-primary-blue prose-strong:text-gray-900 text-justify prose-p:text-justify"
              dangerouslySetInnerHTML={{
                __html: data.detailedDescription,
              }}
            />
          )}
        </div>
      </AnimatedSection>

      {data.objectives && (
        <AnimatedSection className="rounded-3xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <svg
                className="h-6 w-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-indigo-900">Objectives</h3>
          </div>
          <ul className="space-y-4">
            {stripHtmlTags(data.objectives)
              .split("\n")
              .map((line) => line.trim())
              .filter((line) => line.length > 0)
              .map((objective, index) => (
                <li key={index} className="flex gap-3 text-gray-800">
                  <span className="flex-shrink-0 mt-1.5 h-2 w-2 rounded-full bg-indigo-600"></span>
                  <span className="flex-1 text-base leading-relaxed text-justify">
                    {decodeHtmlEntities(objective)}
                  </span>
                </li>
              ))}
          </ul>
        </AnimatedSection>
      )}

      {data.achievements && (
        <AnimatedSection className="rounded-3xl border-2 border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-8 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <svg
                className="h-6 w-6 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-amber-900">
              Key Achievements
            </h3>
          </div>
          <ul className="space-y-4">
            {stripHtmlTags(data.achievements)
              .split("\n")
              .map((line) => line.trim())
              .filter((line) => line.length > 0)
              .map((achievement, index) => (
                <li key={index} className="flex gap-3 text-gray-800">
                  <span className="flex-shrink-0 mt-1.5 h-2 w-2 rounded-full bg-amber-600"></span>
                  <span className="flex-1 text-base leading-relaxed text-justify">
                    {decodeHtmlEntities(achievement)}
                  </span>
                </li>
              ))}
          </ul>
        </AnimatedSection>
      )}

      {departmentHead && (
        <AnimatedSection className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-2 bg-primary-blue/10 rounded-lg">
              <Users className="h-6 w-6 text-primary-blue" />
            </div>
            <h3 className="text-2xl font-bold text-primary-blue">
              {copy.headTitle}
            </h3>
          </div>
          <div className="flex flex-col items-center max-w-md mx-auto">
            <div className="relative h-36 w-36 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-100 to-purple-100 mb-5 shadow-lg ring-4 ring-white">
              {departmentHead.photo ? (
                <Image
                  src={departmentHead.photo}
                  alt={departmentHead.fullName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-primary-blue">
                  {departmentHead.fullName.charAt(0)}
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-primary-blue mb-1">
                {departmentHead.titlePrefixDisplay} {departmentHead.fullName}
              </p>
              <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">
                {departmentHead.designationDisplay ||
                  departmentHead.designation}
              </p>
              {departmentHead.email && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                  <Mail className="h-4 w-4 text-primary-blue" />
                  <p className="text-sm text-gray-700">
                    {departmentHead.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>
      )}

      {memberOfficials.length > 0 && (
        <AnimatedSection className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-2 bg-primary-blue/10 rounded-lg">
              <Users className="h-6 w-6 text-primary-blue" />
            </div>
            <h3 className="text-2xl font-bold text-primary-blue">
              Key Staff Members
            </h3>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {memberOfficials.map((official) => (
              <div
                key={official.uuid}
                className="flex flex-col items-center w-56 p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-28 w-28 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 mb-4 shadow-md ring-2 ring-white">
                  {official.photo ? (
                    <Image
                      src={official.photo}
                      alt={official.fullName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-primary-blue">
                      {official.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-primary-blue mb-1">
                    {official.titlePrefixDisplay} {official.fullName}
                  </p>
                  <p className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-3">
                    {official.designationDisplay || official.designation}
                  </p>
                  {official.email && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs text-gray-600 shadow-sm">
                      <Mail className="h-3 w-3 text-primary-blue" />
                      <span className="truncate max-w-[150px]">
                        {official.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      )}
    </div>
  );
}
