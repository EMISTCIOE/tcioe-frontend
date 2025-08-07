import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://api-staging.tcioe.edu.np";

// Helper function to check if string is UUID format
function isUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

// Helper function to convert slug to club name search
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
    let clubUuid = identifier;

    // If it's not a UUID, treat it as a slug and find the club
    if (!isUUID(identifier)) {
      // First, try to get all clubs and find by slug or name
      const clubsUrl = `${API_BASE_URL}/api/v1/public/website-mod/clubs/`;
      const clubsResponse = await fetch(clubsUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 },
      });

      if (clubsResponse.ok) {
        const clubsData = await clubsResponse.json();
        const searchTerm = slugToSearchTerm(identifier);

        // Find club by name match (case insensitive)
        const club = clubsData.results?.find(
          (c: any) =>
            c.name
              .toLowerCase()
              .replace(/[^a-z0-9\s]/g, "")
              .replace(/\s+/g, "-") === identifier.toLowerCase() ||
            c.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (club) {
          clubUuid = club.uuid;
        } else {
          return NextResponse.json(
            { error: "Club not found" },
            { status: 404 }
          );
        }
      }
    }

    const backendUrl = `${API_BASE_URL}/api/v1/public/website-mod/clubs/${clubUuid}`;

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
        return NextResponse.json({ error: "Club not found" }, { status: 404 });
      }
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Club details API error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch club details",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
