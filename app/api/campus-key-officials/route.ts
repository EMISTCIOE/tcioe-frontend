import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://cdn.tcioe.edu.np";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();

    const page = searchParams.get("page");
    const limit = searchParams.get("limit") || "12";

    if (page) {
      const offset = (parseInt(page) - 1) * parseInt(limit);
      params.append("offset", offset.toString());
    }

    if (limit) {
      params.append("limit", limit);
    }

    const search = searchParams.get("search");
    if (search) {
      params.append("search", search);
    }

    const designation = searchParams.get("designation");
    if (designation) {
      params.append("designation", designation);
    }

    const isKeyOfficial = searchParams.get("is_key_official");
    if (isKeyOfficial) {
      params.append("is_key_official", isKeyOfficial);
    }

    const ordering = searchParams.get("ordering") || "display_order";
    params.append("ordering", ordering);

    const backendUrl = `${API_BASE_URL}/api/v1/public/website-mod/campus-key-officials?${params.toString()}`;

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
        `Backend returned ${response.status} for campus key officials. Returning empty results.`
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
    console.error("Campus Staff API error:", error);

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
