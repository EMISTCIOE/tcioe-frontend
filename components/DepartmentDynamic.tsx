"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Atom,
  Bell,
  BookOpen,
  Calendar,
  Download,
  ExternalLink,
  FileText,
  Layers,
  Sparkles,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useDepartmentByCode } from "@/hooks/use-department-by-code";
import { useDepartmentEvents } from "@/hooks/use-department-events";
import { useDepartmentPlans } from "@/hooks/use-department-plans";
import { useDepartmentPrograms } from "@/hooks/use-department-programs";
import { useDepartmentProjects } from "@/hooks/use-department-projects";
import { useDepartmentResearch } from "@/hooks/use-department-research";
import { useDepartmentJournals } from "@/hooks/use-department-journals";
import { useDepartmentClubs } from "@/hooks/use-department-clubs";
import { useFilteredGlobalGallery } from "@/hooks/use-filtered-global-gallery";
import { useGlobalEvents } from "@/hooks/use-global-events";
import { useNotices } from "@/hooks/use-notices";
import { getDepartmentUrl } from "@/lib/department-mapping";

const formatDate = (value?: string | null) => {
  if (!value) return "TBD";
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return value;
  }
};

const formatDateRange = (from?: string | null, to?: string | null) => {
  if (!from && !to) return "Dates coming soon";
  const start = formatDate(from);
  if (!to) return start;
  const end = formatDate(to);
  return start === end ? start : `${start} — ${end}`;
};

const toPlainText = (value?: string | null) =>
  value
    ? value
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : "";

const truncateText = (value?: string | null, limit = 120) => {
  const text = toPlainText(value);
  if (!text) return "";
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 1)}…`;
};

const humanizeType = (value?: string | null) =>
  value
    ? value
        .split(/[_\s]+/)
        .map(
          (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        )
        .join(" ")
    : "";

export function DepartmentDynamic({ slug: code }: { slug: string }) {
  const { department, loading } = useDepartmentByCode(code);
  const departmentSlug = department?.slug ?? "";
  const departmentUuid = department?.uuid ?? "";
  const noticeParams = React.useMemo(() => {
    if (!departmentUuid) return undefined;
    return {
      department: departmentUuid,
      limit: 1,
      ordering: "-publishedAt",
    };
  }, [departmentUuid]);
  const { events: departmentEvents, loading: eventsLoading } =
    useDepartmentEvents(departmentSlug, {
      ordering: "-eventStartDate",
      limit: 3,
    });
  const { programs, loading: programsLoading } = useDepartmentPrograms(
    departmentSlug,
    { limit: 3 }
  );
  const { plans, loading: plansLoading } = useDepartmentPlans(departmentSlug, {
    limit: 1,
  });
  const { notices, loading: noticesLoading } = useNotices(noticeParams);
  const { research, loading: researchLoading } = useDepartmentResearch(
    departmentSlug,
    {
      limit: 1,
      ordering: "-date_published",
    }
  );
  const { projects, loading: projectsLoading } = useDepartmentProjects(
    departmentSlug,
    {
      limit: 1,
      ordering: "-created_at",
    }
  );
  const { journals, loading: journalsLoading } = useDepartmentJournals(
    departmentSlug,
    {
      limit: 1,
      ordering: "-date_published",
    }
  );
  const { items: galleryItems, loading: galleryLoading } =
    useFilteredGlobalGallery({
      sourceType: "department_gallery",
      sourceIdentifier: departmentUuid,
      limit: 6,
    });
  const { clubs, loading: clubsLoading } = useDepartmentClubs(departmentUuid);

  // Fetch department events
  const { events: departmentOnlyEvents, loading: deptEventsLoading } =
    useGlobalEvents({
      limit: 10,
      department: departmentUuid,
    });

  // Fetch club events for all department clubs
  const clubUuids = React.useMemo(() => clubs.map((c) => c.uuid), [clubs]);
  const [clubEvents, setClubEvents] = React.useState<any[]>([]);
  const [clubEventsLoading, setClubEventsLoading] = React.useState(false);

  React.useEffect(() => {
    if (clubUuids.length === 0) {
      setClubEvents([]);
      return;
    }

    const fetchClubEvents = async () => {
      setClubEventsLoading(true);
      try {
        // Fetch events for each club and combine
        const promises = clubUuids.map(async (clubUuid) => {
          const response = await fetch(
            `/api/global-events?club=${clubUuid}&limit=10`
          );
          const data = await response.json();
          return data?.results ?? [];
        });

        const allClubEventArrays = await Promise.all(promises);
        const combined = allClubEventArrays.flat();

        // Remove duplicates based on uuid
        const uniqueEvents = Array.from(
          new Map(combined.map((event) => [event.uuid, event])).values()
        );

        setClubEvents(uniqueEvents);
      } catch (error) {
        console.error("Failed to fetch club events:", error);
        setClubEvents([]);
      } finally {
        setClubEventsLoading(false);
      }
    };

    fetchClubEvents();
  }, [clubUuids]);

  // Combine department and club events
  const rawCampusEvents = React.useMemo(() => {
    const combined = [...departmentOnlyEvents, ...clubEvents];
    // Remove duplicates based on uuid
    const uniqueEvents = Array.from(
      new Map(combined.map((event) => [event.uuid, event])).values()
    );
    console.log("📊 Combined events:", {
      departmentEvents: departmentOnlyEvents.length,
      clubEvents: clubEvents.length,
      uniqueTotal: uniqueEvents.length,
    });
    return uniqueEvents;
  }, [departmentOnlyEvents, clubEvents]);

  const campusEventsLoading = deptEventsLoading || clubEventsLoading;

  // Filter to only show department-specific events or club events
  // Exclude union events and campus-wide events
  const campusEvents = React.useMemo(() => {
    if (!rawCampusEvents || !departmentUuid) return [];

    // Get list of club UUIDs that belong to this department
    const departmentClubUuids = clubs.map((club) => club.uuid);

    // Debug logging
    console.log("🔍 Department UUID:", departmentUuid);
    console.log(
      "🔍 Department Clubs:",
      clubs.map((c) => ({ uuid: c.uuid, name: c.name }))
    );
    console.log("🔍 Raw Campus Events:", rawCampusEvents.length);
    console.log(
      "🔍 All Events Detail:",
      rawCampusEvents.map((e) => ({
        title: e.title,
        clubs: e.clubs,
        departments: e.departments,
        unions: e.unions,
      }))
    );

    const filtered = rawCampusEvents
      .filter((event: any) => {
        console.log(`\n🔎 Processing event: "${event.title}"`);
        console.log(`  - Event clubs:`, event.clubs);
        console.log(`  - Event departments:`, event.departments);
        console.log(`  - Event unions:`, event.unions);

        // Exclude events that have union links (these are union/campus-wide events)
        const hasUnionLink = event.unions && event.unions.length > 0;
        if (hasUnionLink) {
          console.log(`  ❌ Excluded - has union link`);
          return false;
        }

        // Check if event is linked to any of this department's clubs
        const eventClubUuids = event.clubs?.map((c: any) => c.uuid || c) || [];
        console.log(`  - Event club UUIDs:`, eventClubUuids);
        console.log(`  - Department club UUIDs:`, departmentClubUuids);

        const hasThisDepartmentClubLink = eventClubUuids.some(
          (clubUuid: string) => departmentClubUuids.includes(clubUuid)
        );
        console.log(`  - Has department club link:`, hasThisDepartmentClubLink);

        // If it has links to this department's clubs, INCLUDE it
        if (hasThisDepartmentClubLink) {
          console.log(
            `✅ Included "${event.title}" - linked to department club`
          );
          return true;
        }

        // Check department links
        const eventDepartmentUuids =
          event.departments?.map((d: any) => d.uuid || d) || [];
        const isLinkedToThisDepartment =
          eventDepartmentUuids.includes(departmentUuid);
        const isMultiDepartment = eventDepartmentUuids.length > 1;

        // If it's linked to multiple departments, it's campus-wide, exclude it
        if (isMultiDepartment) {
          console.log(`❌ Excluded "${event.title}" - multi-department event`);
          return false;
        }

        // If it's linked only to this single department, include it
        if (isLinkedToThisDepartment && !isMultiDepartment) {
          console.log(`✅ Included "${event.title}" - single department event`);
          return true;
        }

        console.log(`❌ Excluded "${event.title}" - no matching criteria`);
        return false;
      })
      .slice(0, 3); // Limit to 3 after filtering

    console.log("🎯 Filtered Events Count:", filtered.length);
    return filtered;
  }, [rawCampusEvents, departmentUuid, clubs]);

  // Sort campusEvents by date to get the most upcoming event
  const sortedCampusEvents = React.useMemo(() => {
    return [...campusEvents].sort((a, b) => {
      const dateA = new Date(a.eventStartDate || "").getTime();
      const dateB = new Date(b.eventStartDate || "").getTime();
      return dateB - dateA; // Most recent first
    });
  }, [campusEvents]);

  const latestEvent = sortedCampusEvents[0]; // Use combined dept + club events
  const latestNotice = notices[0];
  const latestPlan = plans[0];
  const researchSpotlight = research[0];
  const projectSpotlight = projects[0];
  const journalSpotlight = journals[0];
  const programPreview = programs.slice(0, 2);
  const galleryPreview = galleryItems.slice(0, 6);
  const campusEventPreview = sortedCampusEvents.slice(0, 3);
  const externalBase = department?.shortName
    ? getDepartmentUrl(department.shortName)
    : "#";
  const researchUrl = department?.shortName
    ? `${externalBase}/research`
    : "/research";
  const projectUrl = department?.shortName
    ? `${externalBase}/projects`
    : "/projects";
  const journalUrl = department?.shortName
    ? `${externalBase}/journal`
    : "https://tcioe.edu.np/journal";

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-16">
        <Skeleton className="h-12 w-1/2 mb-4 mx-auto" />
        <Skeleton className="h-6 w-1/4 mb-10 mx-auto" />
        <Skeleton className="h-40 w-full mb-8" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Department Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The department you are looking for does not exist or has been moved.
        </p>
        <Link href="/departments">
          <Button variant="default">View All Departments</Button>
        </Link>
      </div>
    );
  }

  const quickLinks = [
    {
      title: "Academic Programs",
      description: "Explore our undergraduate and graduate programs",
      icon: BookOpen,
      href: `${externalBase}programs`,
    },
    {
      title: "Faculty & Staff",
      description: "Meet our experienced faculty members",
      icon: Users,
      href: `${externalBase}faculty`,
    },
    {
      title: "Events",
      description: "View upcoming and past department events",
      icon: Calendar,
      href: `${externalBase}events`,
    },
    {
      title: "Downloads",
      description: "Access forms, syllabi, and resources",
      icon: Download,
      href: `${externalBase}downloads`,
    },
    {
      title: "Plans & Policies",
      description: "Department guidelines and policies",
      icon: FileText,
      href: `${externalBase}plans`,
    },
    {
      title: "About Department",
      description: "Learn more about our department",
      icon: ExternalLink,
      href: `${externalBase}about`,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <section className="relative bg-gradient-to-r from-primary-blue to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {department.name}
            </h1>
            {department.shortName && (
              <p className="text-xl md:text-2xl font-semibold mb-6 text-blue-100">
                {department.shortName}
              </p>
            )}
            {department.briefDescription && (
              <p className="text-lg md:text-xl text-blue-50 max-w-3xl mx-auto">
                {department.briefDescription}
              </p>
            )}
            <div className="mt-10">
              <Link
                href={externalBase}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-white text-primary-blue hover:bg-gray-100 font-semibold text-lg px-8 py-6 h-auto"
                >
                  Visit Department Website
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-4xl mx-auto mb-10 space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground font-semibold">
              Academic highlights
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Research, projects & journal in focus
            </h2>
            <p className="text-gray-600 text-lg">
              A single representative research brief, standout project, and
              journal article keep you connected with the department’s latest
              scholarship.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="bg-white/80 border border-border/50 shadow-lg shadow-slate-200/60 backdrop-blur">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    <Atom className="h-5 w-5 text-primary" />
                    Research
                  </div>
                  {researchSpotlight?.status && (
                    <Badge variant="outline">
                      {humanizeType(researchSpotlight.status)}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold leading-tight">
                      {researchSpotlight?.title ||
                        "New research publications will appear here soon"}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground line-clamp-3">
                      {researchSpotlight
                        ? truncateText(researchSpotlight.abstract, 140)
                        : "Our labs and faculty share real-world solutions for industry and society."}
                    </CardDescription>
                  </div>
                  {researchSpotlight?.thumbnail && (
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={researchSpotlight.thumbnail}
                        alt={researchSpotlight.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {researchLoading ? (
                  <Skeleton className="h-4 w-36" />
                ) : researchSpotlight ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      {researchSpotlight.department?.name ||
                        "Department research"}{" "}
                      ·{" "}
                      {researchSpotlight.fundingAgency ||
                        "Sponsored initiative"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(researchSpotlight.startDate)} –{" "}
                      {researchSpotlight.endDate
                        ? formatDate(researchSpotlight.endDate)
                        : "Ongoing"}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    A featured research background will be highlighted when it
                    is approved for release.
                  </p>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  asChild
                >
                  <Link href={researchUrl} target="_blank" rel="noreferrer">
                    View research stories
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-white/90 border border-border/50 shadow-lg shadow-slate-200/50 backdrop-blur">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    <Layers className="h-5 w-5 text-primary" />
                    Projects
                  </div>
                  {projectSpotlight?.status && (
                    <Badge variant="outline">
                      {humanizeType(projectSpotlight.status)}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold leading-tight">
                      {projectSpotlight?.title ||
                        "Student and faculty projects appear here soon"}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground line-clamp-3">
                      {projectSpotlight
                        ? truncateText(projectSpotlight.abstract, 140)
                        : "Hands-on innovations and prototypes drive departmental excellence."}
                    </CardDescription>
                  </div>
                  {projectSpotlight?.thumbnail && (
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={projectSpotlight.thumbnail}
                        alt={projectSpotlight.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {projectsLoading ? (
                  <Skeleton className="h-4 w-28" />
                ) : projectSpotlight ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      {projectSpotlight.department?.name ||
                        "Department project"}{" "}
                      · {projectSpotlight.academicYear || "Academic update"}
                    </p>
                    {projectSpotlight.projectType && (
                      <p className="text-sm text-muted-foreground">
                        {humanizeType(projectSpotlight.projectType)}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    We'll show a featured capstone or research project soon.
                  </p>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  asChild
                >
                  <Link href={projectUrl} target="_blank" rel="noreferrer">
                    Explore featured project
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-white/90 border border-border/50 shadow-lg shadow-slate-200/50 backdrop-blur">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Journal
                  </div>
                  {journalSpotlight?.genre && (
                    <Badge variant="outline">{journalSpotlight.genre}</Badge>
                  )}
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold leading-tight">
                      {journalSpotlight?.title ||
                        "Journal citations and articles will appear here shortly"}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground line-clamp-3">
                      {journalSpotlight
                        ? truncateText(journalSpotlight.abstract, 120)
                        : "Stay tuned for the latest published articles tied to the department."}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {journalsLoading ? (
                  <Skeleton className="h-4 w-32" />
                ) : journalSpotlight ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Published in{" "}
                      {journalSpotlight.discipline || "department journal"}
                    </p>
                    {journalSpotlight.doiId && (
                      <p className="text-sm text-muted-foreground">
                        DOI: {journalSpotlight.doiId}
                      </p>
                    )}
                    {journalSpotlight.authors?.length ? (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {journalSpotlight.authors
                          .map((author) =>
                            [author.givenName, author.familyName]
                              .filter(Boolean)
                              .join(" ")
                          )
                          .join(", ")}
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    We'll highlight department-aligned journal work once
                    available.
                  </p>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  asChild
                >
                  <Link href={journalUrl} target="_blank" rel="noreferrer">
                    Read journal article
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-4xl mx-auto mb-10 space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-primary font-semibold">
              Department pulse
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Live glimpses from{" "}
              {department?.shortName || department?.name || "your department"}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="h-full">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Latest event
                  </span>
                  {latestEvent?.eventType && (
                    <Badge variant="outline">
                      {humanizeType(latestEvent.eventType)}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-snug">
                      {latestEvent?.title ||
                        `Upcoming department & club event information will arrive soon.`}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {latestEvent
                        ? truncateText(
                            latestEvent.description ||
                              latestEvent.descriptionShort,
                            90
                          )
                        : "Planning is still underway. Check the department website for the full calendar."}
                    </CardDescription>
                  </div>
                  {latestEvent?.thumbnail && (
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={latestEvent.thumbnail}
                        alt={latestEvent.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {campusEventsLoading ? (
                  <Skeleton className="h-4 w-32" />
                ) : latestEvent ? (
                  <p className="text-sm text-muted-foreground">
                    {formatDateRange(
                      latestEvent.eventStartDate,
                      latestEvent.eventEndDate
                    )}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No event has been posted yet.
                  </p>
                )}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link
                    href={`${externalBase}/events`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View department events
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground/80" />
                    <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      Latest notice
                    </span>
                  </div>
                  {latestNotice?.category?.name && (
                    <Badge variant="outline">
                      {latestNotice.category.name}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-snug">
                      {latestNotice?.title || "Notices will appear here soon"}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {latestNotice
                        ? truncateText(latestNotice.description, 90)
                        : "The department will share circulars and updates shortly."}
                    </CardDescription>
                  </div>
                  {latestNotice?.thumbnail && (
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={latestNotice.thumbnail}
                        alt={latestNotice.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {noticesLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : latestNotice ? (
                  <p className="text-sm text-muted-foreground">
                    Published {formatDate(latestNotice.publishedAt)}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nothing new on the notice board yet.
                  </p>
                )}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link
                    href={`${externalBase}/notices`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Browse official notices
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Plans & policies
                  </span>
                  {latestPlan?.createdAt && (
                    <Badge variant="outline">
                      {formatDate(latestPlan.createdAt)}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg leading-snug">
                  {latestPlan?.title || "Policy documents coming soon"}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {latestPlan
                    ? truncateText(latestPlan.description, 120)
                    : "Strategic plans, guidelines, and policies will appear here when published."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {plansLoading && <Skeleton className="h-4 w-28" />}
              </CardContent>
              <CardFooter className="pt-0">
                {latestPlan?.file ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <a href={latestPlan.file} target="_blank" rel="noreferrer">
                      Open plan & policy
                    </a>
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Document will go live once the department publishes it.
                  </p>
                )}
              </CardFooter>
            </Card>

            <Card className="md:col-span-2 h-full">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Academic focus
                  </span>
                  <Badge variant="outline">Programs</Badge>
                </div>
                <CardTitle className="text-lg leading-snug">
                  What students are learning right now
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {department?.shortName
                    ? `${department.shortName} keeps the curriculum agile with these programs.`
                    : "Academic highlights and programs from the department."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {programsLoading && <Skeleton className="h-4 w-32" />}
                  {!programsLoading && programPreview.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Core programs are being curated.
                    </p>
                  )}
                  {!programsLoading &&
                    programPreview.map((program) => (
                      <div
                        key={program.uuid}
                        className="rounded-md border border-dashed border-border/70 bg-muted/50 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{program.name}</p>
                          <Badge variant="outline">
                            {humanizeType(program.programType)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {truncateText(program.description, 80)}
                        </p>
                      </div>
                    ))}
                </div>

                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link
                    href={`${externalBase}/programs`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View all programs & subjects
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-4xl mx-auto mb-10 space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-primary font-semibold">
              Student Organizations
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Department Clubs & Societies
            </h2>
            <p className="text-gray-700 text-lg">
              {department?.shortName
                ? `Active student clubs and organizations under ${department.shortName}`
                : "Student-led clubs driving innovation and community engagement."}
            </p>
          </div>

          {clubsLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="h-48 rounded-2xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : clubs.length > 0 ? (
            <div
              className={
                clubs.length === 1
                  ? "flex justify-center"
                  : "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              }
            >
              {clubs.map((club) => {
                console.log("🎨 Rendering club:", {
                  name: club.name,
                  websiteUrl: club.websiteUrl,
                });
                return (
                  <Card
                    key={club.uuid}
                    className={`overflow-hidden hover:shadow-lg transition-shadow ${
                      clubs.length === 1 ? "max-w-md w-full" : ""
                    }`}
                  >
                    {club.thumbnail && (
                      <div className="aspect-video bg-muted overflow-hidden">
                        <img
                          src={club.thumbnail}
                          alt={club.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl">{club.name}</CardTitle>
                      {club.shortDescription && (
                        <CardDescription className="line-clamp-3">
                          {club.shortDescription}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardFooter>
                      {club.websiteUrl ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          asChild
                        >
                          <a
                            href={club.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Visit Club Website
                          </a>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          disabled
                        >
                          No website available
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No clubs are currently registered under this department.
            </p>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-primary-blue/10 to-blue-100/50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-4xl mx-auto mb-10 space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-primary font-semibold">
              Visual stories
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Gallery snapshots & campus buzz
            </h2>
            <p className="text-gray-700 text-lg">
              Handpicked images and campus-wide occurrences connected to the
              department.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="h-full">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Gallery spotlight
                  </span>
                  <Badge variant="outline">Visual recap</Badge>
                </div>
                <CardTitle className="text-lg leading-snug">
                  Moments captured across your labs
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {department?.shortName
                    ? `${department.shortName} moments from labs, events, and fieldwork.`
                    : "Photos submitted from departments across campus."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {galleryLoading ? (
                  <div className="grid grid-cols-2 gap-3">
                    {[...Array(4)].map((_, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg bg-muted animate-pulse"
                      />
                    ))}
                  </div>
                ) : galleryPreview.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {galleryPreview.map((item) => (
                      <div
                        key={item.uuid}
                        className="aspect-square overflow-hidden rounded-lg bg-slate-100"
                      >
                        <img
                          src={item.image}
                          alt={
                            item.caption ||
                            department?.name ||
                            "Department gallery"
                          }
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    The photo wall is being built. Visit the department website
                    for more.
                  </p>
                )}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link
                    href={`${externalBase}/gallery`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Browse the full gallery
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Department events
                  </span>
                  <Badge variant="outline">Dept & Club events</Badge>
                </div>
                <CardTitle className="text-lg leading-snug">
                  Events from department & clubs
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {department?.shortName
                    ? `${department.shortName} events and activities from affiliated student clubs.`
                    : "Department and club events showcasing student initiatives."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {campusEventsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, index) => (
                      <div
                        key={index}
                        className="h-20 rounded-md bg-muted animate-pulse"
                      />
                    ))}
                  </div>
                ) : campusEventPreview.length > 0 ? (
                  <div className="space-y-4">
                    {campusEventPreview.map((event) => (
                      <div
                        key={event.uuid}
                        className="flex gap-3 rounded-lg border border-border/50 p-3 hover:bg-muted/30 transition-colors"
                      >
                        {event.thumbnail && (
                          <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                            <img
                              src={event.thumbnail}
                              alt={event.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-sm line-clamp-1">
                              {event.title}
                            </p>
                            {event.eventType && (
                              <Badge
                                variant="outline"
                                className="shrink-0 text-xs"
                              >
                                {humanizeType(event.eventType)}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDateRange(
                              event.eventStartDate,
                              event.eventEndDate
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {truncateText(event.description, 80)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No campus-facing events are linked to this department at the
                    moment.
                  </p>
                )}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a
                    href={`${externalBase}/events`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View more events
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore {department.shortName || department.name}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Quick access to all department resources and information
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.title}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-transparent hover:border-primary-blue">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="p-3 rounded-lg bg-primary-blue/10 text-primary-blue group-hover:bg-primary-blue group-hover:text-white transition-colors">
                          <Icon className="h-6 w-6" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-blue group-hover:translate-x-1 transition-all" />
                      </div>
                      <CardTitle className="text-xl mt-4 group-hover:text-primary-blue transition-colors">
                        {link.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {link.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary-blue/10 to-blue-100/50">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Want to Learn More?
          </h2>
          <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
            Visit our dedicated department website for complete information
            about programs, faculty, research, and more.
          </p>
          <Link href={externalBase} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="font-semibold px-8 py-6 h-auto text-lg"
            >
              Go to {department.shortName || "Department"} Website
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
