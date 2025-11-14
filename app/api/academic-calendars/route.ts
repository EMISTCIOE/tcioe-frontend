import { NextRequest } from "next/server";
import {
  respondWithList,
  handleApiError,
  validateListResponse,
} from "../utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://cdn.tcioe.edu.np";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Build query parameters for the backend API
    const params = new URLSearchParams();

    // Handle pagination
    const page = searchParams.get("page");
    const limit = searchParams.get("limit") || "20";

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

    // Handle program type filter
    const programType = searchParams.get("programType");
    if (programType) {
      // Ensure programType is in uppercase for the backend API
      params.append("programType", programType.toUpperCase());
    }

    // Handle ordering
    const ordering = searchParams.get("ordering") || "-startYear";
    params.append("ordering", ordering);

    // Make request to backend API
    const backendUrl = `${API_BASE_URL}/api/v1/public/website-mod/academic-calendars?${params.toString()}`;

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
        `Backend returned ${response.status} for academic calendars. Returning empty results.`
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
    return handleApiError(error, "list", "academic-calendars");
  }
}
