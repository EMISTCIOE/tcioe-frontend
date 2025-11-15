import { NextRequest } from "next/server";
import { respondWithList, handleApiError } from "../utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://cdn.tcioe.edu.np";

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
    const backendUrl = `${API_BASE_URL}/api/v1/public/website-mod/campus-unions?${params.toString()}`;
    console.log("Fetching unions from:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      console.error(`Backend API error: ${response.status}`);
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    return respondWithList(data);
  } catch (error) {
    return handleApiError(error, "list", "unions");
  }
}
