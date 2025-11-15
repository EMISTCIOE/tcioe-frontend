import { NextRequest, NextResponse } from "next/server";
import { camelCaseKeys } from "../../utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://cdn.tcioe.edu.np";

// Helper function to check if string is UUID format
function isUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

// Helper function to convert slug to union name search
function slugToSearchTerm(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const identifier = resolvedParams.id;
    let unionUuid = identifier;

    // If it's not a UUID, treat it as a slug and find the union
    if (!isUUID(identifier)) {
      // First, try to get all unions and find by slug or name
      const unionsUrl = `${API_BASE_URL}/api/v1/public/website-mod/unions/`;
      const unionsResponse = await fetch(unionsUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 },
      });

      if (unionsResponse.ok) {
        const unionsData = await unionsResponse.json();
        const searchTerm = slugToSearchTerm(identifier);

        // Find union by name match (case insensitive)
        const union = unionsData.results?.find(
          (u: any) =>
            u.name
              .toLowerCase()
              .replace(/[^a-z0-9\s]/g, "")
              .replace(/\s+/g, "-") === identifier.toLowerCase() ||
            u.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (union) {
          unionUuid = union.uuid;
        } else {
          return NextResponse.json(
            { error: "Union not found" },
            { status: 404 }
          );
        }
      }
    }

    // Try to fetch individual union details using UUID
    const backendUrl = `${API_BASE_URL}/api/v1/public/website-mod/unions/${unionUuid}`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Union not found" }, { status: 404 });
      }
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(camelCaseKeys(data));
  } catch (error) {
    console.error("Union details API error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch union details",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
