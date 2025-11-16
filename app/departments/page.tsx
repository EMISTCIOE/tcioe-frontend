"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatedSection } from "@/components/animated-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDepartments } from "@/hooks/use-departments";

export default function DepartmentsPage() {
  const [search, setSearch] = useState("");
  const { departments, loading } = useDepartments({
    limit: 100,
    ordering: "name",
    search,
  });

  return (
    <div className="min-h-screen bg-white">
      <section className="container mx-auto px-4 lg:px-6 py-12">
        <AnimatedSection>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-blue text-center mb-2">
            Departments
          </h1>
          <p className="text-center text-text-dark mb-8">
            Explore our academic departments.
          </p>
        </AnimatedSection>

        <div className="max-w-xl mx-auto mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search departments..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        ) : departments.length === 0 ? (
          <p className="text-center text-text-light">No departments found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((d) => (
              <Card
                key={d.uuid}
                className="h-full overflow-hidden border border-gray-100 shadow-md"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <Image
                      src={d.thumbnail || "/placeholder-logo.jpg"}
                      alt={d.name}
                      width={56}
                      height={56}
                      className="w-14 h-14 object-cover rounded-full border"
                    />
                    <div>
                      <CardTitle className="text-lg leading-tight">
                        {d.name}
                      </CardTitle>
                      {d.shortName && (
                        <p className="text-sm text-text-light">{d.shortName}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-text-dark line-clamp-4 mb-4">
                    {d.briefDescription || ""}
                  </p>
                  <Link
                    href={`/departments/${d.slug}`}
                    className="text-primary-blue hover:underline font-medium"
                  >
                    View department
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
