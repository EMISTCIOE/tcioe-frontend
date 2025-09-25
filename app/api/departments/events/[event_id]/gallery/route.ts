import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://api-staging.tcioe.edu.np";

// GET /api/departments/events/[event_id]/gallery
// Proxies to: GET /api/v1/public/department-mod/departments/events/{event_id}/gallery
export async function GET(
  request: NextRequest,
  { params }: { params: { event_id: string } }
) {
  try {
    const { event_id } = params;
    const { searchParams } = new URL(request.url);

    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const page = searchParams.get("page");

    const query = new URLSearchParams();
    if (limit) query.append("limit", limit);
    if (offset) query.append("offset", offset);
    if (page && limit && !offset) {
      const off = (parseInt(page) - 1) * parseInt(limit);
      query.append("offset", off.toString());
    }

    const backendUrl = `${API_BASE_URL}/api/v1/public/department-mod/departments/events/${encodeURIComponent(
      event_id
    )}/gallery?${query.toString()}`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Department event gallery API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch event gallery", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

