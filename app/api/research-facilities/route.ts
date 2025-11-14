import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://cdn.tcioe.edu.np"
).replace(/\/+$/, "");

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();

    const limit = searchParams.get("limit") || "20";
    const ordering = searchParams.get("ordering") || "display_order";

    params.append("limit", limit);
    params.append("ordering", ordering);

    const backendUrl = `${API_BASE_URL}/api/v1/public/website-mod/research-facilities?${params.toString()}`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.warn(
        `Backend returned ${response.status} for research facilities. Returning empty results.`
      );
      // Return empty results instead of throwing an error
      return NextResponse.json(
        { results: [], count: 0, next: null, previous: null },
        {
          status: 200,
          headers: {
            "Cache-Control":
              "public, s-maxage=300, stale-while-revalidate=3600",
          },
        }
      );
    }

    const data = await response.json();

    // Ensure we return a proper structure even if data is empty
    const results = data.results || data || [];
    return NextResponse.json(
      {
        results: Array.isArray(results) ? results : [],
        count: data.count || 0,
        next: data.next || null,
        previous: data.previous || null,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    console.error("Research Facilities API error:", error);
    // Return empty results instead of 500 error
    return NextResponse.json(
      { results: [], count: 0, next: null, previous: null },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
        },
      }
    );
  }
}
