import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://api-staging.tcioe.edu.np";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    const { searchParams } = new URL(request.url);
    const eventType = searchParams.get("type") || "campus"; // 'campus' or 'club'

    let backendUrl: string;

    if (eventType === "club") {
      backendUrl = `${API_BASE_URL}/api/v1/public/website-mod/club-events/${eventId}`;
    } else {
      backendUrl = `${API_BASE_URL}/api/v1/public/website-mod/campus-events/${eventId}`;
    }

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
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    // Add source information
    const eventData = {
      ...data,
      source: eventType,
    };

    return NextResponse.json(eventData);
  } catch (error) {
    console.error("Event details API error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch event details",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
