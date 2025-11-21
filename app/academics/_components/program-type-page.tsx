"use client";

import Link from "next/link";
import { useMemo } from "react";
import { GraduationCap, MapPin, Sparkles } from "lucide-react";

import { AnimatedSection } from "@/components/animated-section";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProgramCatalog } from "@/hooks/use-program-catalog";
import type { ProgramCatalogItem } from "@/types";

type ProgramType = "BACHELORS" | "MASTERS" | "DIPLOMA" | "OTHER";

interface ProgramTypePageProps {
  programType: ProgramType;
  title: string;
  subtitle: string;
  highlight?: string;
}

export function ProgramTypePage({
  programType,
  title,
  subtitle,
  highlight,
}: ProgramTypePageProps) {
  const { programs, loading, error } = useProgramCatalog(programType);
  if (typeof window !== "undefined") {
    console.log("ProgramTypePage state", {
      programType,
      loading,
      error,
      programCount: programs.length,
      sample: programs.slice(0, 2),
    });
  }
  const programLabel =
    programType === "BACHELORS"
      ? "Undergraduate"
      : programType === "MASTERS"
      ? "Graduate"
      : programType === "DIPLOMA"
      ? "Diploma"
      : "Program";

  const groupedPrograms = useMemo(() => {
    const groups: Record<
      string,
      {
        department: ProgramCatalogItem["department"];
        programs: ProgramCatalogItem[];
      }
    > = {};

    programs.forEach((program) => {
      const key =
        program.department?.slug || program.department?.name || program.uuid;
      if (!groups[key]) {
        groups[key] = {
          department: program.department,
          programs: [],
        };
      }
      groups[key].programs.push(program);
    });

    return Object.values(groups);
  }, [programs]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/60">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-blue via-blue-600 to-blue-700" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_40%)]" />
        <div className="relative container mx-auto px-4 lg:px-6 py-16 lg:py-20 text-white">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/30 backdrop-blur">
              <GraduationCap className="h-4 w-4" />
              <span>{programLabel} Pathways</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-blue-100">{subtitle}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-6 py-12 lg:py-16 space-y-8">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, idx) => (
              <Card key={idx} className="border border-slate-200 shadow-sm">
                <CardHeader className="space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-40" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700">
            {error}
          </div>
        ) : programs.length === 0 ? (
          <Card className="bg-white/70 border border-dashed border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">No programs to display</CardTitle>
              <CardDescription>
                We couldn&apos;t find any {programType.toLowerCase()} programs
                from the campus catalog right now. Please check back later.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-10">
            {groupedPrograms.map(({ department, programs }) => (
              <AnimatedSection
                key={department?.slug || department?.name}
                className="space-y-4"
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                      Department
                    </p>
                    <h2 className="text-2xl font-semibold text-slate-900">
                      {department?.name || "Academic Department"}
                    </h2>
                    {department?.shortName && (
                      <p className="text-sm text-slate-600">
                        {department.shortName}
                      </p>
                    )}
                  </div>
                  {department?.slug && (
                    <Link
                      href={`/departments/${department.slug}`}
                      className="text-sm font-semibold text-primary-blue hover:text-blue-700 underline underline-offset-4"
                    >
                      Visit department
                    </Link>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {programs.map((program) => (
                    <Card
                      key={program.uuid}
                      className="group border border-slate-200/80 shadow-[0_10px_40px_rgba(15,23,42,0.05)] hover:border-blue-200 transition"
                    >
                      <CardHeader className="space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-primary-blue border-blue-100"
                          >
                            {program.shortName || program.name}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-700"
                          >
                            {programLabel}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl text-slate-900 group-hover:text-primary-blue transition">
                          {program.name}
                        </CardTitle>
                        {program.description && (
                          <CardDescription className="text-slate-600 leading-relaxed">
                            {program.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-primary-blue" />
                          <span>
                            {program.programType === "MASTERS"
                              ? "Graduate"
                              : "Undergraduate"}{" "}
                            degree
                          </span>
                        </div>
                        {department?.name && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-500" />
                            <span>{department.name}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
