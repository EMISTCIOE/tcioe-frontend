import { NextRequest } from "next/server";
import {
  respondWithList,
  handleApiError,
  validateListResponse,
} from "../utils";

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

    // Handle report type filter
    const reportType = searchParams.get("reportType");
    if (reportType) {
      // Ensure reportType is in uppercase for the backend API
      params.append("reportType", reportType.toUpperCase());
    }

    // Handle ordering
    const ordering = searchParams.get("ordering") || "-publishedDate";
    params.append("ordering", ordering);

    // Make request to backend API
    const backendUrl = `${API_BASE_URL}/api/v1/public/website-mod/campus-reports?${params.toString()}`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      console.warn(
        `Backend returned ${response.status} for campus reports. Returning empty results.`
      );
      return respondWithList({
        results: [],
        count: 0,
        next: null,
        previous: null,
      });
    }

    const data = await response.json();
    return respondWithList(validateListResponse(data));
  } catch (error) {
    return handleApiError(error, "list", "campus-reports");
  }
}
