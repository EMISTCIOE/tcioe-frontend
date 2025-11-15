import { NextRequest, NextResponse } from "next/server";
import {
  handleApiError,
  respondWithList,
  validateListResponse,
} from "../utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://cdn.tcioe.edu.np";

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
      return respondWithList({ results: [], count: 0, next: null, previous: null });
    }

    const data = await response.json();
    return respondWithList(validateListResponse(data));
  } catch (error) {
    console.error("Global events API error:", error);
    return handleApiError(error, "list", "global-events");
  }
}
