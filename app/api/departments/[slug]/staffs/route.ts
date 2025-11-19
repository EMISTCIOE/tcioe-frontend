import { NextRequest, NextResponse } from "next/server";
import { camelCaseKeys } from "../../../utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://cdn.tcioe.edu.np";

// GET /api/departments/[slug]/staffs
// Proxies to: GET /api/v1/public/department-mod/departments/{slug}/staffs
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);

    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const page = searchParams.get("page");
    const ordering = searchParams.get("ordering");
    const search = searchParams.get("search");

    const query = new URLSearchParams();
    if (limit) query.append("limit", limit);
    if (offset) query.append("offset", offset);
    if (page && limit && !offset) {
      const off = (parseInt(page) - 1) * parseInt(limit);
      query.append("offset", off.toString());
    }
    if (ordering) query.append("ordering", ordering);
    if (search) query.append("search", search);

    const backendUrl = `${API_BASE_URL}/api/v1/public/department-mod/departments/${encodeURIComponent(
      slug
    )}/staffs?${query.toString()}`;

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
    return NextResponse.json(camelCaseKeys(data));
  } catch (error) {
    console.error("Department staffs API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch department staffs",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
