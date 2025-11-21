"use client";

import React from "react";
import Image from "next/image";
import { Mail, Users } from "lucide-react";

import { AnimatedSection } from "@/components/animated-section";
import {
  formatStaffTitlePrefix,
  useCampusKeyOfficials,
} from "@/hooks/use-campus-key-officials";

const DEFAULT_LIMIT = 100;

export default function OfficialsPage() {
  const { officials, loading, error, pagination, refetch } =
    useCampusKeyOfficials({
      page: 1,
      limit: DEFAULT_LIMIT,
      ordering: "display_order",
      // always fetch key officials for the tcioe site
      isKeyOfficial: true,
    });

  // Without search / filters the list to render is the officials array
  const filteredOfficials = officials;

  type OfficialsRow = {
    key: string;
    items: typeof officials;
  };

  // helper: chunk officials into rows that follow the requested pattern
  const buildHierarchyRows = (items: typeof officials): OfficialsRow[] => {
    const rows: OfficialsRow[] = [];
    const pattern = [1, 3, 5, 1, 5, 3, 3, 4, 5, 2, 2];
    let i = 0;

    for (const size of pattern) {
      if (i >= items.length) break;
      rows.push({
        key: `main-${rows.length}`,
        items: items.slice(i, i + size),
      });
      i += size;
    }

    // leftover items, keep stepping by 3
    while (i < items.length) {
      rows.push({
        key: `main-${rows.length}`,
        items: items.slice(i, i + 3),
      });
      i += 3;
    }

    return rows;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <AnimatedSection className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-primary-blue shadow-sm">
            <Users className="h-4 w-4" />
            Key Officials
          </div>
          <h1 className="text-4xl font-bold text-primary-blue">
            Campus Key Officials
          </h1>
          <p className="text-lg text-text-dark max-w-3xl mx-auto">
            Meet the team of campus leaders responsible for keeping Thapathali
            Campus running smoothly.
          </p>
        </AnimatedSection>

        {/* Search and filtering intentionally removed for TCIOE — page shows key officials only */}

        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-blue/30 border-t-primary-blue"></div>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-700">
            <p className="text-lg font-semibold">Unable to load officials</p>
            <p className="mt-2 text-sm text-gray-600">
              We're having trouble loading the staff directory. Please try again
              shortly.
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
              No key officials found.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              The campus key officials list is currently empty.
            </p>
          </div>
        )}

        {!loading && !error && filteredOfficials.length > 0 && (
          <AnimatedSection delay={0.2} className="space-y-8">
            {buildHierarchyRows(filteredOfficials).map((row) => (
              <div
                key={row.key}
                className="flex justify-center gap-6 items-start flex-wrap"
              >
                {row.items.map((official) => {
                  const prefix = formatStaffTitlePrefix(official.titlePrefix);
                  const displayName = [prefix, official.fullName]
                    .filter(Boolean)
                    .join(" ")
                    .trim();
                  const photoSrc =
                    official.photo || "/placeholder.svg?height=160&width=160";

                  return (
                    <article
                      key={official.uuid}
                      className="group w-full max-w-[14.5rem] flex-shrink-0 flex-grow rounded-[1.5rem] border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.15)]"
                    >
                      <div className="flex justify-center pt-6">
                        <div className="relative h-32 w-32 overflow-hidden rounded-[1.4rem] border-2 border-white bg-gray-50 shadow-[0_15px_45px_rgba(15,23,42,0.1)]">
                          <Image
                            src={photoSrc}
                            alt={displayName}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-center gap-3 px-5">
                        <span className="h-0.5 w-10 bg-orange-400 rounded-full" />
                        <span className="h-0.5 w-10 bg-orange-400 rounded-full" />
                      </div>
                      <div className="flex flex-col gap-1 px-6 pb-6 pt-4 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-blue opacity-80">
                          {official.designationDisplay}
                        </p>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {displayName || official.fullName}
                        </h3>
                        {official.email && (
                          <a
                            href={`mailto:${official.email}`}
                            className="mt-2 inline-flex items-center justify-center gap-2 text-sm font-semibold text-primary-blue transition hover:text-primary-blue/80"
                          >
                            <Mail className="h-4 w-4" />
                            {official.email}
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ))}
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
