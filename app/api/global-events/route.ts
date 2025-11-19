import { NextRequest, NextResponse } from "next/server";
import {
  handleApiError,
  respondWithList,
  validateListResponse,
} from "../utils";

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

function processEventData(data: any, baseUrl: string): any {
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

    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const page = searchParams.get("page");
    const ordering = searchParams.get("ordering");
    const union = searchParams.get("union");
    const club = searchParams.get("club");
    const department = searchParams.get("department");

    const params = new URLSearchParams();
    if (limit) {
      params.append("limit", limit);
    }
    if (offset) {
      params.append("offset", offset);
    }
    if (!offset && page && limit) {
      const off = (parseInt(page, 10) - 1) * parseInt(limit, 10);
      params.append("offset", off.toString());
    }
    if (ordering) {
      params.append("ordering", ordering);
    }
    if (union) {
      params.append("union", union);
    }
    if (club) {
      params.append("club", club);
    }
    if (department) {
      params.append("department", department);
    }

    const backendUrl = `${API_BASE_URL}/api/v1/public/website-mod/global-events?${params.toString()}`;

    console.log("Fetching global events from:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.warn(`Backend global-events returned ${response.status}`);
      return respondWithList({
        results: [],
        count: 0,
        next: null,
        previous: null,
      });
    }

    const data = await response.json();
    console.log(
      "Global events data received, count:",
      data?.results?.length || 0
    );
    console.log(
      "First event detail:",
      JSON.stringify(data?.results?.[0], null, 2)
    );

    // Process the data to ensure image URLs are absolute
    const processedData = processEventData(data, API_BASE_URL);

    console.log(
      "After processing, first event:",
      JSON.stringify(processedData?.results?.[0], null, 2)
    );

    return respondWithList(validateListResponse(processedData));
  } catch (error) {
    console.error("Global events API error:", error);
    return handleApiError(error, "list", "global-events");
  }
}
