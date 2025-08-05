import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://api-staging.tcioe.edu.np";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/public/website-mod/campus-info`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Add cache control
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching campus info:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch campus information",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
