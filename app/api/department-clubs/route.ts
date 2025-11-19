import { NextRequest, NextResponse } from "next/server";
import { camelCaseKeys } from "../utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://cdn.tcioe.edu.np";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentUuid = searchParams.get("department");

    const params = new URLSearchParams();
    if (departmentUuid) {
      params.append("department__uuid", departmentUuid);
    }
    // Add is_active filter to get only active clubs
    params.append("is_active", "true");

    const backendUrl = `${API_BASE_URL}/api/v1/public/website-mod/clubs${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    console.log("Fetching clubs from:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error(`Backend clubs API returned ${response.status}`);
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Clubs data received:", data);

    return NextResponse.json(camelCaseKeys(data), {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Department clubs API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch clubs",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
