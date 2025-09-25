"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatedSection } from "@/components/animated-section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Status = {
  url: string;
  ok: boolean;
  status: number;
  ms: number;
  error?: string;
};

export default function AccessibilityPage() {
  const coreServices = useMemo(
    () => [
      "https://tcioe.edu.np/",
      "https://routine.tcioe.edu.np/",
      "https://elibrary.tcioe.edu.np/",
      "https://lms.tcioe.edu.np/",
      "https://journal.tcioe.edu.np/",
      "https://library.tcioe.edu.np/",
    ],
    []
  );

  const [deptUrls, setDeptUrls] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(false);

  // Pull department subdomains from existing API
  useEffect(() => {
    const loadDepts = async () => {
      try {
        const res = await fetch("/api/departments?limit=100&ordering=name", {
          cache: "no-store",
        });
        const data = await res.json();
        const slugs = (data?.results || [])
          .map((d: any) => d.slug)
          .filter(Boolean);

        // Map long department names to short subdomains
        const departmentSubdomainMap: Record<string, string> = {
          "department-of-applied-science": "doas",
          "department-of-architecture": "doarch",
          "department-of-automobile-mechanical-engineering": "doame",
          "department-of-civil-engineering": "doce",
          "department-of-electronics-computer-engineering": "doece",
          "department-of-industrial-engineering": "doie",
        };

        const urls = slugs.map((s: string) => {
          const shortName = departmentSubdomainMap[s] || s;
          return `https://${shortName}.tcioe.edu.np/`;
        });
        setDeptUrls(urls);
      } catch {
        // ignore; page still works with core services
      }
    };
    loadDepts();
  }, []);

  const allUrls = useMemo(
    () => [...coreServices, ...deptUrls],
    [coreServices, deptUrls]
  );

  const runCheck = async () => {
    if (allUrls.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: allUrls, timeoutMs: 6000 }),
      });
      const data = await res.json();
      setStatuses(data?.results || []);
    } catch {
      setStatuses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deptUrls.length]);

  return (
    <AnimatedSection className="container mx-auto px-4 lg:px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-primary-blue mb-2">
          Accessibility
        </h1>
        <p className="text-text-dark mb-6">
          We strive for an inclusive, accessible experience. Below is a live
          status check of key campus services and departmental sites.
        </p>

        <div className="mb-6">
          <Button onClick={runCheck} disabled={loading}>
            {loading ? "Checking..." : "Re-check Service Status"}
          </Button>
        </div>

        <Card className="p-5">
          <h2 className="text-xl font-semibold mb-4">Service Status</h2>
          {statuses.length === 0 ? (
            <p className="text-sm text-muted-foreground">Fetching status...</p>
          ) : (
            <div className="grid gap-3">
              {statuses
                .sort((a, b) => {
                  // First sort: main tcioe.edu.np always first
                  if (a.url === "https://tcioe.edu.np/") return -1;
                  if (b.url === "https://tcioe.edu.np/") return 1;

                  // Second sort: online services before offline
                  if (a.ok && !b.ok) return -1;
                  if (!a.ok && b.ok) return 1;

                  // Third sort: alphabetically
                  return a.url.localeCompare(b.url);
                })
                .map((s) => (
                  <div
                    key={s.url}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      s.ok
                        ? "border-green-200 bg-green-50 hover:border-green-300"
                        : "border-red-200 bg-red-50 hover:border-red-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              s.ok ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          {s.ok && (
                            <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{s.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {s.ok ? (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-4 bg-green-500 rounded-sm" />
                            <div className="w-2 h-6 bg-green-500 rounded-sm" />
                            <div className="w-2 h-3 bg-green-500 rounded-sm" />
                            <div className="w-2 h-5 bg-green-500 rounded-sm" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-1 bg-red-500 rounded-sm" />
                            <div className="w-2 h-1 bg-red-300 rounded-sm" />
                            <div className="w-2 h-1 bg-red-300 rounded-sm" />
                            <div className="w-2 h-1 bg-red-300 rounded-sm" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Card>

        <div className="mt-10 space-y-4 text-sm text-text-dark">
          <h2 className="text-xl font-semibold">
            Our Accessibility Commitments
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Semantic HTML and keyboard-navigable interfaces.</li>
            <li>Color contrast aligned with WCAG AA where feasible.</li>
            <li>ARIA labels for interactive components.</li>
            <li>Continuous monitoring of service availability.</li>
          </ul>
        </div>
      </div>
    </AnimatedSection>
  );
}
