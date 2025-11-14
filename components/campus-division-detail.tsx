"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Phone,
  RefreshCcw,
  Users,
} from "lucide-react";
import { AnimatedSection } from "@/components/animated-section";
import { useCampusDivisionDetail } from "@/hooks/use-campus-divisions";
import { stripHtmlTags } from "@/lib/utils";

interface CampusDivisionDetailProps {
  slug: string;
  kind: "sections" | "units";
}

const KIND_COPY = {
  sections: {
    title: "Campus Section",
    baseHref: "/about/sections",
    description:
      "Explore the responsibilities, goals, and team members who lead this section.",
  },
  units: {
    title: "Campus Unit",
    baseHref: "/about/units",
    description:
      "Learn more about this unit's mission, services, and dedicated officers.",
  },
};

export function CampusDivisionDetailView({
  slug,
  kind,
}: CampusDivisionDetailProps) {
  const { data, loading, error, refetch } = useCampusDivisionDetail(
    kind,
    slug
  );
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
            <h1 className="text-3xl font-bold text-primary-blue">{data.name}</h1>
            <p className="mt-3 text-gray-600">{copy.description}</p>
          </div>
        )}

        <div className="grid gap-6 border-t border-gray-100 p-6 md:grid-cols-3">
          <div className="rounded-2xl bg-gray-50 p-4">
            <MapPin className="mb-2 h-5 w-5 text-primary-blue" />
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Location
            </p>
            <p className="text-sm text-gray-800">
              {data.location || "Not specified"}
            </p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-4">
            <Mail className="mb-2 h-5 w-5 text-primary-blue" />
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Email
            </p>
            <p className="text-sm text-gray-800">
              {data.contactEmail || "Not provided"}
            </p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-4">
            <Phone className="mb-2 h-5 w-5 text-primary-blue" />
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Phone
            </p>
            <p className="text-sm text-gray-800">
              {data.contactPhone || "Not provided"}
            </p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-primary-blue mb-4">
          About this {copy.title.toLowerCase()}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {stripHtmlTags(data.shortDescription)}
        </p>
        {data.detailedDescription && (
          <div
            className="prose prose-indigo mt-4 max-w-none text-gray-700"
            dangerouslySetInnerHTML={{
              __html: data.detailedDescription,
            }}
          />
        )}
      </AnimatedSection>

      {data.objectives && (
        <AnimatedSection className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-primary-blue mb-3">
            Objectives
          </h3>
          <div
            className="prose prose-indigo max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: data.objectives }}
          />
        </AnimatedSection>
      )}

      {data.achievements && (
        <AnimatedSection className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-primary-blue mb-3">
            Key Achievements
          </h3>
          <div
            className="prose prose-indigo max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: data.achievements }}
          />
        </AnimatedSection>
      )}

      {departmentHead && (
        <AnimatedSection className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-5 w-5 text-primary-blue" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Unit Head
              </p>
              <h3 className="text-xl font-semibold text-primary-blue">
                Department Head
              </h3>
            </div>
          </div>
          <div className="flex gap-4 rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-gray-100">
              {departmentHead.photo ? (
                <Image
                  src={departmentHead.photo}
                  alt={departmentHead.fullName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-primary-blue">
                  {departmentHead.fullName.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-500">
                {departmentHead.titlePrefixDisplay}
              </p>
              <p className="text-lg font-semibold text-primary-blue">
                {departmentHead.fullName}
              </p>
              <p className="text-sm text-gray-600">
                {departmentHead.designation}
              </p>
              {departmentHead.email && (
                <p className="text-xs text-gray-500 mt-1">
                  {departmentHead.email}
                </p>
              )}
              {departmentHead.phoneNumber && (
                <p className="text-xs text-gray-500">
                  {departmentHead.phoneNumber}
                </p>
              )}
              {departmentHead.bio && (
                <p className="text-xs text-gray-500 mt-1">
                  {stripHtmlTags(departmentHead.bio)}
                </p>
              )}
            </div>
          </div>
        </AnimatedSection>
      )}

      {memberOfficials.length > 0 && (
        <AnimatedSection className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-5 w-5 text-primary-blue" />
            <h3 className="text-xl font-semibold text-primary-blue">
              Key Officials
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {memberOfficials.map((official) => (
              <div
                key={official.uuid}
                className="flex gap-4 rounded-2xl border border-gray-100 p-4 shadow-sm"
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-gray-100">
                  {official.photo ? (
                    <Image
                      src={official.photo}
                      alt={official.fullName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-primary-blue">
                      {official.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500">
                    {official.titlePrefixDisplay}
                  </p>
                  <p className="text-lg font-semibold text-primary-blue">
                    {official.fullName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {official.designation}
                  </p>
                  {official.email && (
                    <p className="text-xs text-gray-500 mt-1">
                      {official.email}
                    </p>
                  )}
                  {official.phoneNumber && (
                    <p className="text-xs text-gray-500">
                      {official.phoneNumber}
                    </p>
                  )}
                  {official.bio && (
                    <p className="text-xs text-gray-500 mt-1">
                      {stripHtmlTags(official.bio)}
                    </p>
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
