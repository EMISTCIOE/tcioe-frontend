"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Mail, Phone, Search, Users } from "lucide-react";

import { AnimatedSection } from "@/components/animated-section";
import {
  formatStaffTitlePrefix,
  useCampusKeyOfficials,
} from "@/hooks/use-campus-key-officials";
import { stripHtmlTags, truncateText } from "@/lib/utils";

const DEFAULT_LIMIT = 100;

export default function OfficialsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [showKeyOnly, setShowKeyOnly] = useState(false);

  const { officials, loading, error, pagination, refetch } =
    useCampusKeyOfficials({
      page: 1,
      limit: DEFAULT_LIMIT,
      ordering: "display_order",
      isKeyOfficial: showKeyOnly ? true : undefined,
    });

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const designationOptions = useMemo(() => {
    const entries = new Map<string, string>();
    officials.forEach((official) => {
      if (official.designationDisplay) {
        entries.set(official.designation, official.designationDisplay);
      }
    });
    return Array.from(entries.entries()).sort(([, a], [, b]) =>
      a.localeCompare(b)
    );
  }, [officials]);

  const filteredOfficials = useMemo(() => {
    return officials.filter((official) => {
      const matchesDesignation = designationFilter
        ? official.designation === designationFilter
        : true;
      const combinedValue = `${official.fullName} ${official.designationDisplay}`.toLowerCase();
      const matchesSearch = normalizedSearch
        ? combinedValue.includes(normalizedSearch)
        : true;

      return matchesDesignation && matchesSearch;
    });
  }, [officials, normalizedSearch, designationFilter]);

  const totalRecords = pagination.count || officials.length;

  const clearFilters = () => {
    setSearchTerm("");
    setDesignationFilter("");
    setShowKeyOnly(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <AnimatedSection className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-primary-blue shadow-sm">
            <Users className="h-4 w-4" />
            Staff Directory
          </div>
          <h1 className="text-4xl font-bold text-primary-blue">
            Campus Staff Members
          </h1>
          <p className="text-lg text-text-dark max-w-3xl mx-auto">
            Meet the team of campus leaders and staff members responsible for
            keeping Thapathali Campus running smoothly.
          </p>
        </AnimatedSection>

        <AnimatedSection
          delay={0.1}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or post"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-700 focus:border-primary-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-blue/20"
                aria-label="Search campus officials"
              />
            </div>

            <div className="flex w-full flex-col gap-2 md:w-72">
              <label
                htmlFor="designation-filter"
                className="text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Filter by role
              </label>
              <select
                id="designation-filter"
                value={designationFilter}
                onChange={(event) => setDesignationFilter(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-3 text-sm text-gray-700 focus:border-primary-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-blue/20"
              >
                <option value="">All roles</option>
                {designationOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 md:w-auto">
              <input
                type="checkbox"
                checked={showKeyOnly}
                onChange={(event) => setShowKeyOnly(event.target.checked)}
                className="h-4 w-4 accent-primary-blue"
              />
              Show key officials only
            </label>
          </div>

          {(searchTerm || designationFilter || showKeyOnly) && (
            <div className="mt-4 text-right">
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-medium text-primary-blue hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </AnimatedSection>

        {!loading && !error && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
            <span>
              Showing{" "}
              <strong className="text-primary-blue">
                {filteredOfficials.length}
              </strong>{" "}
              of {totalRecords || filteredOfficials.length} staff members
            </span>
            <span className="text-gray-500">
              Updated automatically from the EMIS CMS
            </span>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-blue/30 border-t-primary-blue"></div>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-700">
            <p className="text-lg font-semibold">Unable to load officials</p>
            <p className="mt-2 text-sm text-gray-600">
              We're having trouble loading the staff directory. Please try again shortly.
            </p>
            <button
              type="button"
              onClick={refetch}
              className="mt-4 rounded-full bg-primary-blue px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary-blue/90"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && filteredOfficials.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-gray-800">
              No staff members match your filters.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Try clearing the search or selecting a different post.
            </p>
          </div>
        )}

        {!loading && !error && filteredOfficials.length > 0 && (
          <AnimatedSection
            delay={0.2}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredOfficials.map((official) => {
              const prefix = formatStaffTitlePrefix(official.titlePrefix);
              const displayName = [prefix, official.fullName]
                .filter(Boolean)
                .join(" ")
                .trim();
              const messagePreview = truncateText(
                stripHtmlTags(official.message),
                140
              );
              const photoSrc =
                official.photo || "/placeholder.svg?height=160&width=160";

              return (
                <article
                  key={official.uuid}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-48 w-full bg-gradient-to-br from-primary-blue/10 to-secondary/10">
                    <Image
                      src={photoSrc}
                      alt={displayName}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-4 bottom-4 rounded-full bg-white/80 px-3 py-1 text-center text-xs font-semibold text-primary-blue shadow">
                      {official.designationDisplay}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary-blue">
                        {official.designationDisplay}
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-gray-900">
                        {displayName || official.fullName}
                      </h3>
                    </div>
                    {messagePreview && (
                      <p className="text-sm leading-relaxed text-gray-600">
                        {messagePreview}
                      </p>
                    )}
                    <div className="mt-auto flex flex-col gap-2 text-sm text-gray-600">
                      {official.email && (
                        <a
                          href={`mailto:${official.email}`}
                          className="flex items-center gap-2 text-primary-blue hover:underline"
                        >
                          <Mail className="h-4 w-4" />
                          {official.email}
                        </a>
                      )}
                      {official.phoneNumber && (
                        <a
                          href={`tel:${official.phoneNumber}`}
                          className="flex items-center gap-2 text-gray-700"
                        >
                          <Phone className="h-4 w-4" />
                          {official.phoneNumber}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
