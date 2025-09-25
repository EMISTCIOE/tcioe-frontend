"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedSection } from "@/components/animated-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDepartment } from "@/hooks/use-department";
import { useDepartmentPrograms } from "@/hooks/use-department-programs";
import { useDepartmentStaffs } from "@/hooks/use-department-staffs";
import { useDepartmentEvents } from "@/hooks/use-department-events";
import { useDepartmentDownloads } from "@/hooks/use-department-downloads";
import { useDepartmentPlans } from "@/hooks/use-department-plans";
import { useDepartmentEventGallery } from "@/hooks/use-department-event-gallery";
// no notices here by request

export function DepartmentDynamic({ slug }: { slug: string }) {
  const { department, loading: deptLoading } = useDepartment(slug);
  const { programs, loading: progLoading } = useDepartmentPrograms(slug, {
    limit: 100,
    ordering: "name",
  });
  const { staffs, loading: staffLoading } = useDepartmentStaffs(slug, {
    limit: 6,
    ordering: "displayOrder",
  });
  const { events, loading: eventsLoading } = useDepartmentEvents(slug, {
    limit: 50,
    ordering: "-eventStartDate",
  });
  const { downloads, loading: downloadsLoading } = useDepartmentDownloads(
    slug,
    { limit: 100 }
  );
  const { plans, loading: plansLoading } = useDepartmentPlans(slug, {
    limit: 100,
  });

  const departmentSubdomainMap: Record<string, string> = {
    "department-of-applied-science": "doas",
    "department-of-architecture": "doarch",
    "department-of-automobile-and-mechanical-engineering": "doame",
    "department-of-civil-engineering": "doce",
    "department-of-electronics-and-computer-engineering": "doece",
    "department-of-industrial-engineering": "doie",
  };
  const subdomain = departmentSubdomainMap[slug] || slug;
  const externalBase = `https://${subdomain}.tcioe.edu.np`;

  const loading =
    deptLoading ||
    progLoading ||
    staffLoading ||
    eventsLoading ||
    downloadsLoading ||
    plansLoading;

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-16">
        <Skeleton className="h-9 w-1/3 mb-6" />
        <Skeleton className="h-6 w-2/3 mb-10" />
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-16 text-center">
        <p className="text-lg">Department not found.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero with background logo/thumbnail */}
      <section className="relative w-full">
        <div className="relative flex items-center justify-center py-16 md:py-24 overflow-hidden">
          {department.thumbnail && (
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url(${department.thumbnail})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(1px)",
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-white/80" />
          <div className="relative text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-blue">
              {department.name}
            </h1>
            {department.shortName && (
              <p className="mt-2 text-text-light">{department.shortName}</p>
            )}
          </div>
        </div>
      </section>

      {/* Description box */}
      <section className="container mx-auto px-4 lg:px-6 -mt-8 md:-mt-10">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8">
          {department.briefDescription ? (
            <p className="text-gray-800 text-base md:text-lg leading-relaxed text-justify">
              {department.briefDescription}
            </p>
          ) : (
            <p className="text-text-light">No description available.</p>
          )}
        </div>
      </section>

      {/* Programs (after description) */}
      <section className="py-12 bg-gradient-to-br from-white to-light-teal">
        <div className="container mx-auto px-4 lg:px-6">
          <AnimatedSection>
            <h2 className="text-2xl font-semibold text-[#1A1A2E] mb-6">
              Academic Programs
            </h2>
          </AnimatedSection>
          {!programs || programs.length === 0 ? (
            <p className="text-sm text-text-light">No programs available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((p) => (
                <AnimatedSection key={p.uuid}>
                  <ProgramCard program={p} />
                </AnimatedSection>
              ))}
            </div>
          )}
          <div className="mt-6">
            <Link
              href={`${externalBase}/programs`}
              className="text-primary-blue hover:underline font-medium"
            >
              See more programs
            </Link>
          </div>
        </div>
      </section>

      {/* Faculty & Staff (limit 6) */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <AnimatedSection>
            <h2 className="text-2xl font-semibold text-[#1A1A2E] mb-6">
              Faculty & Staff
            </h2>
          </AnimatedSection>
          {!staffs || staffs.length === 0 ? (
            <p className="text-sm text-text-light">No staff listed.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffs.map((s) => (
                <Card
                  key={s.uuid}
                  className="h-full shadow-md border border-gray-100"
                >
                  <CardHeader className="flex flex-row items-center gap-3">
                    <Image
                      src={s.photo || "/placeholder-user.jpg"}
                      alt={s.name}
                      width={64}
                      height={64}
                      className="rounded-[30%] object-cover w-16 h-16"
                    />
                    <div>
                      <CardTitle className="text-base">
                        {s.title ? `${s.title} ` : ""}
                        {s.name}
                      </CardTitle>
                      <p className="text-sm text-text-light">{s.designation}</p>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
          <div className="mt-6">
            <Link
              href={`${externalBase}/faculty`}
              className="text-primary-blue hover:underline font-medium"
            >
              See full faculty list
            </Link>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-12 bg-gradient-to-br from-white to-teal-light">
        <div className="container mx-auto px-4 lg:px-6">
          <AnimatedSection>
            <h2 className="text-2xl font-semibold text-[#1A1A2E] mb-6">
              Department Events
            </h2>
          </AnimatedSection>
          {!events || events.length === 0 ? (
            <p className="text-sm text-text-light">No events.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((e) => (
                <EventCardWithGallery
                  key={e.uuid}
                  eventId={e.uuid}
                  title={e.title}
                  start={e.eventStartDate}
                  end={e.eventEndDate}
                  type={e.eventType}
                  thumbnail={(e as any).thumbnail}
                  description={(e as any).descriptionShort}
                />
              ))}
            </div>
          )}
          <div className="mt-6">
            <Link
              href={`${externalBase}/events`}
              className="text-primary-blue hover:underline font-medium"
            >
              See more events
            </Link>
          </div>
        </div>
      </section>

      {/* Plans & Policies + Downloads (side by side on desktop) */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Plans & Policies */}
            <div>
              <AnimatedSection>
                <h2 className="text-2xl font-semibold text-[#1A1A2E] mb-6">
                  Plans & Policies
                </h2>
              </AnimatedSection>
              {!plans || plans.length === 0 ? (
                <p className="text-sm text-text-light">No plans.</p>
              ) : (
                <div className="space-y-4">
                  {plans.map((p) => (
                    <Card
                      key={p.uuid}
                      className="shadow-sm border border-gray-100"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">{p.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {p.description && (
                          <p className="text-sm text-text-dark mb-3">
                            {p.description}
                          </p>
                        )}
                        <Link
                          href={p.file}
                          target="_blank"
                          className="text-primary-blue hover:underline font-medium"
                        >
                          View file
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <Link
                  href={`${externalBase}/plans`}
                  className="text-primary-blue hover:underline font-medium"
                >
                  See all plans & policies
                </Link>
              </div>
            </div>

            {/* Downloads */}
            <div>
              <AnimatedSection>
                <h2 className="text-2xl font-semibold text-[#1A1A2E] mb-6">
                  Downloads
                </h2>
              </AnimatedSection>
              {!downloads || downloads.length === 0 ? (
                <p className="text-sm text-text-light">No downloads.</p>
              ) : (
                <div className="space-y-4">
                  {downloads.map((d) => (
                    <Card
                      key={d.uuid}
                      className="shadow-sm border border-gray-100"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">{d.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {d.description && (
                          <p className="text-sm text-text-dark mb-3">
                            {d.description}
                          </p>
                        )}
                        <Link
                          href={d.file}
                          target="_blank"
                          className="text-primary-blue hover:underline font-medium"
                        >
                          Download file
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <Link
                  href={`${externalBase}/downloads`}
                  className="text-primary-blue hover:underline font-medium"
                >
                  See all downloads
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function EventCardWithGallery({
  eventId,
  title,
  start,
  end,
  type,
  thumbnail,
  description,
}: {
  eventId: string;
  title: string;
  start: string;
  end?: string;
  type: string;
  thumbnail?: string | null;
  description?: string | null;
}) {
  // Always show gallery; fetch a generous page size
  const { gallery, loading } = useDepartmentEventGallery(eventId, {
    limit: 100,
  });
  return (
    <Card className="overflow-hidden shadow-md border border-gray-100">
      {thumbnail && (
        <div className="w-full h-40 overflow-hidden">
          <Image
            src={thumbnail}
            alt={title}
            width={800}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            {type}
          </span>
          <p className="text-sm text-text-dark">
            {start}
            {end && end !== start ? ` - ${end}` : ""}
          </p>
        </div>
        {description && (
          <p className="text-sm text-text-dark mb-3 line-clamp-3">
            {description}
          </p>
        )}
        <div className="mt-3">
          {loading ? (
            <p className="text-sm text-text-light">Loading gallery…</p>
          ) : gallery.length === 0 ? (
            <p className="text-sm text-text-light">No gallery images.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {gallery.map((g) => (
                <Image
                  key={g.uuid}
                  src={g.image}
                  alt={g.caption}
                  width={200}
                  height={150}
                  className="object-cover w-full h-24 rounded"
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ProgramCard({ program }: { program: any }) {
  return (
    <Card className="h-full shadow-md border border-gray-100 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg leading-tight mr-2">
            {program.name}
          </CardTitle>
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
            {program.programType}
          </span>
        </div>
        {program.shortName && (
          <p className="text-sm text-text-light mt-1">{program.shortName}</p>
        )}
      </CardHeader>
      <CardContent>
        {program.thumbnail && (
          <div className="mb-3">
            <Image
              src={program.thumbnail}
              alt={program.name}
              width={640}
              height={360}
              className="w-full h-36 object-cover rounded"
            />
          </div>
        )}
        {program.description && (
          <p className="text-sm text-text-dark leading-relaxed line-clamp-5">
            {program.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
