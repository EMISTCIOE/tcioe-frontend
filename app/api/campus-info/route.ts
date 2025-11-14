import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://cdn.tcioe.edu.np";

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
      console.warn(
        `Backend returned ${response.status} for campus info. Returning empty data instead of error.`
      );
      // Return empty data instead of throwing an error
      return NextResponse.json(
        { message: "No campus information available" },
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

    // Check if data is empty or null
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "No campus information available" },
        {
          status: 200,
          headers: {
            "Cache-Control":
              "public, s-maxage=300, stale-while-revalidate=3600",
          },
        }
      );
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching campus info:", error);

    // Return empty data instead of error to prevent breaking the UI
    return NextResponse.json(
      { message: "No campus information available" },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
        },
      }
    );
  }
}
