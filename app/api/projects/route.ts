import { NextRequest } from "next/server";
import {
  handleApiError,
  respondWithList,
  validateListResponse,
} from "../utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://cdn.tcioe.edu.np";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const page = searchParams.get("page");

    const query = new URLSearchParams();
    if (limit) query.append("limit", limit);
    if (offset) query.append("offset", offset);
    if (page && limit && !offset) {
      const off = (parseInt(page, 10) - 1) * parseInt(limit, 10);
      query.append("offset", off.toString());
    }

    const allowed = [
      "department_slug",
      "project_type",
      "status",
      "ordering",
      "search",
      "is_featured",
    ];
    for (const key of allowed) {
      const value = searchParams.get(key);
      if (value) {
        query.append(key, value);
      }
    }

    const backendUrl = `${API_BASE_URL}/api/v1/public/project-mod/projects?${query.toString()}`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    return respondWithList(validateListResponse(data));
  } catch (error) {
    console.error("Projects API error:", error);
    return handleApiError(error, "list", "projects");
  }
}
