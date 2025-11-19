import { NextRequest, NextResponse } from "next/server";
import {
  respondWithList,
  handleApiError,
  validateListResponse,
} from "../utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://cdn.tcioe.edu.np";

// GET /api/departments
// Proxies to: GET /api/v1/public/department-mod/departments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params = new URLSearchParams();

    // Accept both page/limit and offset/limit
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const ordering = searchParams.get("ordering");
    const search = searchParams.get("search");

    if (offset) params.append("offset", offset);
    if (limit) params.append("limit", limit);
    if (page && limit && !offset) {
      const off = (parseInt(page) - 1) * parseInt(limit);
      params.append("offset", off.toString());
    }
    if (ordering) params.append("ordering", ordering);
    if (search) params.append("search", search);

    const backendUrl = `${API_BASE_URL}/api/v1/public/department-mod/departments?${params.toString()}`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.warn(
        `Backend returned ${response.status} for departments. Returning empty results.`
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
    return handleApiError(error, "list", "departments");
  }
}
