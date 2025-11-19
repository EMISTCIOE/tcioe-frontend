import { NextRequest, NextResponse } from "next/server";
import { camelCaseKeys } from "../utils";

function resolveImageUrl(imageUrl: string, baseUrl: string): string {
  if (!imageUrl) return imageUrl;

  // If the URL is already absolute, return as is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // If it's a relative URL, prepend the base URL
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanImageUrl = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;

  return `${cleanBaseUrl}${cleanImageUrl}`;
}

function processClubData(data: any, baseUrl: string): any {
  if (!data) return data;

  // Process results array
  if (data.results && Array.isArray(data.results)) {
    data.results = data.results.map((item: any) => ({
      ...item,
      thumbnail: item.thumbnail
        ? resolveImageUrl(item.thumbnail, baseUrl)
        : item.thumbnail,
    }));
  }

  return data;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://cdn.tcioe.edu.np";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Build query parameters for the backend API
    const params = new URLSearchParams();

    // Handle pagination
    const page = searchParams.get("page");
    const limit = searchParams.get("limit") || "10";

    if (page) {
      const offset = (parseInt(page) - 1) * parseInt(limit);
      params.append("offset", offset.toString());
    }

    if (limit) {
      params.append("limit", limit);
    }

    // Handle search
    const search = searchParams.get("search");
    if (search) {
      params.append("search", search);
    }

    // Make request to backend API
    const backendUrl = `${API_BASE_URL}/api/v1/public/website-mod/clubs?${params.toString()}`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    // Process the data to ensure image URLs are absolute
    const processedData = processClubData(data, API_BASE_URL);

    return NextResponse.json(camelCaseKeys(processedData));
  } catch (error) {
    console.error("Clubs API error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch clubs",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
