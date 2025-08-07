import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://api-staging.tcioe.edu.np";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get event type (campus or club)
    const eventType = searchParams.get("type") || "all"; // 'campus', 'club', or 'all'

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

    // Handle event type filter for campus events
    const campusEventType = searchParams.get("eventType");
    if (campusEventType) {
      params.append("eventType", campusEventType);
    }

    let campusEvents = [];
    let clubEvents = [];
    let totalCount = 0;

    // Fetch campus events
    if (eventType === "campus" || eventType === "all") {
      try {
        const campusUrl = `${API_BASE_URL}/api/v1/public/website-mod/campus-events?${params.toString()}`;
        const campusResponse = await fetch(campusUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (campusResponse.ok) {
          const campusData = await campusResponse.json();
          campusEvents = campusData.results.map((event: any) => ({
            ...event,
            source: "campus",
          }));
          if (eventType === "campus") {
            totalCount = campusData.count;
          }
        }
      } catch (error) {
        console.error("Error fetching campus events:", error);
      }
    }

    // Fetch club events
    if (eventType === "club" || eventType === "all") {
      try {
        const clubUrl = `${API_BASE_URL}/api/v1/public/website-mod/club-events?${params.toString()}`;
        const clubResponse = await fetch(clubUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (clubResponse.ok) {
          const clubData = await clubResponse.json();
          clubEvents = clubData.results.map((event: any) => ({
            ...event,
            source: "club",
          }));
          if (eventType === "club") {
            totalCount = clubData.count;
          }
        }
      } catch (error) {
        console.error("Error fetching club events:", error);
      }
    }

    // Combine and sort events if fetching both
    let allEvents = [];
    if (eventType === "all") {
      allEvents = [...campusEvents, ...clubEvents];

      // Sort by date (newest first)
      allEvents.sort((a, b) => {
        const dateA = new Date(a.eventStartDate || a.date);
        const dateB = new Date(b.eventStartDate || b.date);
        return dateB.getTime() - dateA.getTime();
      });

      totalCount = allEvents.length;

      // Apply client-side pagination for combined results
      const pageNum = parseInt(page || "1");
      const limitNum = parseInt(limit);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      allEvents = allEvents.slice(startIndex, endIndex);
    } else if (eventType === "campus") {
      allEvents = campusEvents;
    } else if (eventType === "club") {
      allEvents = clubEvents;
    }

    // Calculate pagination info
    const pageNum = parseInt(page || "1");
    const limitNum = parseInt(limit);
    const hasNext = pageNum * limitNum < totalCount;
    const hasPrevious = pageNum > 1;

    const response = {
      count: totalCount,
      next: hasNext ? `${pageNum + 1}` : null,
      previous: hasPrevious ? `${pageNum - 1}` : null,
      results: allEvents,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Events API error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch events",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
