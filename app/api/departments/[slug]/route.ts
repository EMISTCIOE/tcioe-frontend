import { NextRequest, NextResponse } from "next/server";
import { camelCaseKeys } from "../../utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://cdn.tcioe.edu.np";

// GET /api/departments/[slug]
// Proxies to: GET /api/v1/public/department-mod/departments/{slug}
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const backendUrl = `${API_BASE_URL}/api/v1/public/department-mod/departments/${encodeURIComponent(
      slug
    )}`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Department not found" },
          { status: 404 }
        );
      }
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(camelCaseKeys(data));
  } catch (error) {
    console.error("Department detail API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch department",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
