import { NextRequest, NextResponse } from "next/server";
import { camelCaseKeys } from "../utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://cdn.tcioe.edu.np";

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

function processGalleryData(data: any, baseUrl: string): any {
  if (!data) return data;

  // Process results array
  if (data.results && Array.isArray(data.results)) {
    data.results = data.results.map((item: any) => ({
      ...item,
      image: resolveImageUrl(item.image, baseUrl),
    }));
  }

  return data;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams(searchParams);
    const backendUrl = `${API_BASE_URL}/api/v1/public/website-mod/global-gallery?${params.toString()}`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    // Process the data to ensure image URLs are absolute
    const processedData = processGalleryData(data, API_BASE_URL);

    return NextResponse.json(camelCaseKeys(processedData), {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Global gallery API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch gallery",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
