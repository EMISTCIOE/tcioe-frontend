import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://cdn.tcioe.edu.np";

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
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Campus Key Officials API error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch campus key officials",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
