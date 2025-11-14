import { NextResponse } from "next/server";

/**
 * Helper function for list/paginated API responses with fallback to empty
 * Instead of returning 500 errors when backend fails, return empty results
 */
export function respondWithList(data: any, options: { status?: number } = {}) {
  // Ensure we have a valid list response structure
  const response = {
    results: Array.isArray(data?.results) ? data.results : [],
    count: data?.count || 0,
    next: data?.next || null,
    previous: data?.previous || null,
  };

  return NextResponse.json(response, {
    status: options.status || 200,
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}

/**
 * Helper function for single object API responses
 */
export function respondWithObject(
  data: any,
  options: { status?: number } = {}
) {
  return NextResponse.json(data || {}, {
    status: options.status || 200,
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}

/**
 * Helper function to handle API errors gracefully
 * Returns empty data instead of 500 errors
 */
export function handleApiError(
  error: any,
  type: "list" | "object" = "list",
  context: string = ""
) {
  console.error(`API Error (${context}):`, error);

  if (type === "list") {
    return respondWithList(
      { results: [], count: 0, next: null, previous: null },
      { status: 200 }
    );
  }

  return respondWithObject({ message: "No data available" }, { status: 200 });
}

/**
 * Helper to ensure backend response is valid before returning
 */
export function validateListResponse(response: any): any {
  if (!response || typeof response !== "object") {
    return { results: [], count: 0, next: null, previous: null };
  }

  return {
    results: Array.isArray(response.results) ? response.results : [],
    count: response.count || 0,
    next: response.next || null,
    previous: response.previous || null,
  };
}
