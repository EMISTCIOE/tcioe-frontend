import env from "@/lib/env";
import type { PaginatedResponse, ResearchItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BookOpen, Building2, Calendar, Search } from "lucide-react";

type DepartmentOption = {
  slug: string;
  name: string;
  shortName?: string | null;
};

const API_BASE = env.API_BASE_URL || "https://cdn.tcioe.edu.np";
const PAGE_SIZE = 12;

const RESEARCH_TYPES = [
  { value: "all", label: "All types" },
  { value: "applied", label: "Applied" },
  { value: "basic", label: "Basic" },
  { value: "development", label: "Development" },
  { value: "interdisciplinary", label: "Interdisciplinary" },
  { value: "collaborative", label: "Collaborative" },
];

const RESEARCH_STATUSES = [
  { value: "all", label: "All status" },
  { value: "published", label: "Published" },
  { value: "ongoing", label: "Ongoing" },
  { value: "proposal", label: "Proposal" },
  { value: "completed", label: "Completed" },
];

const asSingleValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] ?? "" : value ?? "";

const titleize = (value?: string | null) =>
  value
    ? value
        .split(/[_\s]+/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(" ")
    : "";

const formatDate = (value?: string | null) => {
  if (!value) return "";
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

const formatCurrency = (value?: number | string | null) => {
  if (value === undefined || value === null || value === "") return "";
  const amount = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(amount)) return `${value}`;
  try {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount}`;
  }
};

// Keep thumbnails working when the API returns relative or localhost URLs
const normalizeImageUrl = (image?: string | null) => {
  if (!image) return "";
  try {
    const parsed = new URL(image);
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      return env.getApiUrl(parsed.pathname + parsed.search + parsed.hash);
    }
    return parsed.toString();
  } catch {
    const path = image.startsWith("/") ? image : `/${image}`;
    return env.getApiUrl(path);
  }
};

const buildPageHref = (
  page: number,
  params: {
    searchTerm?: string;
    department?: string;
    type?: string;
    status?: string;
  }
) => {
  const query = new URLSearchParams();
  if (params.searchTerm) query.set("q", params.searchTerm);
  if (params.department) query.set("department", params.department);
  if (params.type && params.type !== "all") query.set("type", params.type);
  if (params.status && params.status !== "all") query.set("status", params.status);
  query.set("page", page.toString());
  const qs = query.toString();
  return qs ? `/research?${qs}` : "/research";
};

const buildPageNumbers = (current: number, total: number): Array<number | "ellipsis"> => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, idx) => idx + 1);
  }

  const pages: Array<number | "ellipsis"> = [];
  const start = Math.max(1, current - 2);
  const end = Math.min(total, current + 2);

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("ellipsis");
  }

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  if (end < total) {
    if (end < total - 1) pages.push("ellipsis");
    pages.push(total);
  }

  return pages;
};

async function fetchDepartments(): Promise<DepartmentOption[]> {
  try {
    const response = await fetch(
      `${API_BASE}/api/v1/public/department-mod/departments?limit=200`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch departments (${response.status})`);
    }

    const data = await response.json();
    return (data?.results || []).map((dept: any) => ({
      slug: dept.slug || dept.shortName || dept.short_name,
      name: dept.name,
      shortName: dept.shortName || dept.short_name,
    }));
  } catch (error) {
    console.warn("departments fetch failed:", error);
    return [];
  }
}

async function fetchResearchList(params: {
  searchTerm?: string;
  department?: string;
  page: number;
  type?: string;
  status?: string;
}): Promise<PaginatedResponse<ResearchItem>> {
  const query = new URLSearchParams();
  query.set("limit", PAGE_SIZE.toString());
  query.set("page", params.page.toString());
  query.set("ordering", "-start_date");
  if (params.searchTerm) query.set("search", params.searchTerm);
  if (params.department) query.set("department_slug", params.department);
  if (params.type && params.type !== "all") query.set("research_type", params.type);
  if (params.status && params.status !== "all") query.set("status", params.status);

  const response = await fetch(
    `${API_BASE}/api/v1/public/research-mod/research?${query.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch research (${response.status})`);
  }

  const data = (await response.json()) as PaginatedResponse<ResearchItem>;
  return data;
}

export default async function ResearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const searchTerm = asSingleValue(searchParams?.q);
  const selectedDepartment = asSingleValue(searchParams?.department);
  const selectedType = asSingleValue(searchParams?.type) || "all";
  const selectedStatus = asSingleValue(searchParams?.status) || "all";
  const rawPage = parseInt(asSingleValue(searchParams?.page) || "1", 10);
  const currentPage = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const [departments, researchResultOrError] = await Promise.all([
    fetchDepartments(),
    fetchResearchList({
      searchTerm,
      department: selectedDepartment,
      page: currentPage,
      type: selectedType,
      status: selectedStatus,
    }).catch((error: Error) => error),
  ]);

  const researchError =
    researchResultOrError instanceof Error ? researchResultOrError.message : null;
  const researchResult =
    researchResultOrError instanceof Error ? null : researchResultOrError;

  const researchItems = researchResult?.results ?? [];
  const totalCount = researchResult?.count ?? 0;
  const totalPages = researchResult ? Math.max(1, Math.ceil(totalCount / PAGE_SIZE)) : 1;
  const showPagination = researchResult ? totalPages > 1 : false;
  const rangeStart =
    researchResult && researchItems.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd =
    researchResult && researchItems.length > 0
      ? (currentPage - 1) * PAGE_SIZE + researchItems.length
      : 0;

  const selectedDepartmentName =
    departments.find((dept) => dept.slug === selectedDepartment)?.name || "";

  const filterSummary = [
    searchTerm ? `“${searchTerm}”` : null,
    selectedDepartmentName || selectedDepartment
      ? `Dept: ${selectedDepartmentName || selectedDepartment}`
      : null,
    selectedType !== "all" ? titleize(selectedType) : null,
    selectedStatus !== "all" ? titleize(selectedStatus) : null,
  ]
    .filter(Boolean)
    .join(" • ");

  const pageNumbers = showPagination
    ? buildPageNumbers(currentPage, totalPages)
    : ([] as Array<number | "ellipsis">);

  return (
    <div className="bg-background py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
        <header className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-primary font-semibold">
            Research & Projects
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            College-wide research showcase
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Browse funded initiatives, applied research, and student-led projects across every
            department. Use the filters to jump to a department or refine by status.
          </p>
        </header>

        <section className="space-y-4">
          <form className="grid gap-3 md:grid-cols-[1.6fr,1fr,1fr,auto] items-center rounded-lg border border-border/60 bg-muted/40 p-4">
            <input type="hidden" name="page" value="1" />
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={searchTerm}
                placeholder="Search by title, abstract, or investigator"
                className="pl-9"
              />
            </div>

            <div className="w-full">
              <label className="sr-only" htmlFor="department">
                Department
              </label>
              <select
                id="department"
                name="department"
                defaultValue={selectedDepartment}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">All departments</option>
                {departments.map((dept) => (
                  <option key={dept.slug} value={dept.slug}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <label className="sr-only" htmlFor="type">
                Research type
              </label>
              <select
                id="type"
                name="type"
                defaultValue={selectedType}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {RESEARCH_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex w-full items-center gap-2">
              <div className="flex-1">
                <label className="sr-only" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={selectedStatus}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {RESEARCH_STATUSES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Apply
              </button>
            </div>
          </form>

          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Research library</h2>
                <p className="text-sm text-muted-foreground">
                  {researchResult
                    ? `Showing ${rangeStart || 0}–${rangeEnd || 0} of ${totalCount} items`
                    : "Search and filter to explore research output across departments."}
                </p>
              </div>
            </div>
            {filterSummary && (
              <p className="text-xs text-muted-foreground">Filters: {filterSummary}</p>
            )}
          </div>

          {researchError && (
            <p className="text-sm text-red-600">Unable to load research: {researchError}</p>
          )}

          {!researchError && researchItems.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No research matched your filters yet. Try a different search or department.
            </p>
          )}

          {researchItems.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {researchItems.map((item) => (
                <Card key={item.id} className="h-full border border-border/70 shadow-sm">
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                    {item.thumbnail ? (
                      <img
                        src={normalizeImageUrl(item.thumbnail)}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        Thumbnail coming soon
                      </div>
                    )}
                  </div>
                  <CardHeader className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary">{titleize(item.researchType)}</Badge>
                      <Badge variant="outline">{titleize(item.status)}</Badge>
                      {item.startDate && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(item.startDate)}
                          {item.endDate ? ` – ${formatDate(item.endDate)}` : ""}
                        </span>
                      )}
                      {item.departmentName && (
                        <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1">
                          <Building2 className="h-3.5 w-3.5" />
                          {item.departmentName}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-xl leading-snug">{item.title}</CardTitle>
                      <CardDescription className="line-clamp-3">
                        {item.abstract || "Abstract coming soon."}
                      </CardDescription>
                    </div>
                    {item.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.categories.map((cat) => (
                          <span
                            key={cat.id}
                            className="text-xs px-2 py-1 rounded-full bg-muted"
                            style={
                              cat.color
                                ? { border: `1px solid ${cat.color}`, color: cat.color }
                                : {}
                            }
                          >
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>
                        <span className="font-semibold text-foreground">PI: </span>
                        {item.principalInvestigatorShort || "Not listed"}
                      </div>
                      {item.fundingAgency && (
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="font-semibold text-foreground">Funding:</span>
                          <span>{item.fundingAgency}</span>
                          {item.fundingAmount && <span>{formatCurrency(item.fundingAmount)}</span>}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{item.viewsCount ?? 0} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        <span>{item.participantsCount ?? 0} participants</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {showPagination && (
            <Pagination className="pt-2">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={buildPageHref(currentPage - 1, {
                        searchTerm,
                        department: selectedDepartment,
                        type: selectedType,
                        status: selectedStatus,
                      })}
                    />
                  </PaginationItem>
                )}

                {pageNumbers.map((page, idx) =>
                  page === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href={buildPageHref(page, {
                          searchTerm,
                          department: selectedDepartment,
                          type: selectedType,
                          status: selectedStatus,
                        })}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      href={buildPageHref(currentPage + 1, {
                        searchTerm,
                        department: selectedDepartment,
                        type: selectedType,
                        status: selectedStatus,
                      })}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </section>
      </div>
    </div>
  );
}
