import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://cdn.tcioe.edu.np"
).replace(/\/+$/, "");

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    // If the param looks like a UUID, fetch detail directly.
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (uuidRegex.test(slug)) {
      const backendUrl = `${API_BASE_URL}/api/v1/public/website-mod/campus-units/${slug}`;
      const response = await fetch(backendUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data, {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
        },
      });
    }

    // Fallback: backend may require UUIDs for detail endpoints. Try to
    // resolve by slug by fetching the list and finding a matching item.
    // This keeps frontend routes (which use slug paths) working even after
    // the backend migrated to UUID-based lookups.
    const listUrl = `${API_BASE_URL}/api/v1/public/website-mod/campus-units?limit=1000`;
    const listResp = await fetch(listUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!listResp.ok) {
      throw new Error(`Backend list API error: ${listResp.status}`);
    }

    const listData = await listResp.json();
    const found = (listData?.results || []).find(
      (r: any) => r.slug === slug || r.name === slug
    );

    if (!found) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(found, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Campus Unit detail API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch campus unit detail",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
