import { NextRequest, NextResponse } from "next/server";
import { camelCaseKeys } from "../../utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://cdn.tcioe.edu.np";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const { searchParams } = new URL(request.url);
    const eventType = searchParams.get("type") || "campus"; // 'campus' or 'club'

    // Check if the incoming id is a UUID or slug
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        eventId
      );

    let targetEvent: any = null;

    // If it's a UUID, try the detail endpoint first for better performance
    if (isUUID) {
      try {
        const detailUrl = `${API_BASE_URL}/api/v1/public/website-mod/global-events/${eventId}`;
        const detailResponse = await fetch(detailUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (detailResponse.ok) {
          targetEvent = camelCaseKeys(await detailResponse.json()) as any;
        }
      } catch (error) {
        console.log(
          "Detail endpoint not available, falling back to list endpoint"
        );
      }
    }

    // If we don't have the event yet (slug or detail endpoint failed), use the list approach
    if (!targetEvent) {
      // Build backend query by forwarding relevant query params that the backend actually supports
      // Based on backend code: club, union, department UUIDs + limit, offset (not page)
      const forwarded = new URLSearchParams();
      const allowed = ["club", "union", "department", "limit", "offset"];
      for (const key of allowed) {
        const v = searchParams.get(key);
        if (v) forwarded.append(key, v);
      }

      // Ensure we fetch a reasonable number of results to find the desired event
      if (!forwarded.get("limit")) forwarded.set("limit", "200");

      const backendUrl = `${API_BASE_URL}/api/v1/public/website-mod/global-events?${forwarded.toString()}`;

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
          return NextResponse.json(
            { error: "Events not found" },
            { status: 404 }
          );
        }
        throw new Error(`Backend API error: ${response.status}`);
      }

      const data = camelCaseKeys(await response.json()) as any;

      // Helper slugifier (same rules as frontend)
      const slugify = (title: string) =>
        title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim()
          .replace(/^-+|-+$/g, "");

      // Debug: what we fetched
      console.log("Events fetched from backend:", (data.results || []).length);

      if (isUUID) {
        targetEvent = data.results?.find(
          (event: any) => event.uuid === eventId
        );
      } else {
        // match by generated slug
        targetEvent = data.results?.find(
          (event: any) => slugify(event.title || "") === eventId
        );
      }

      if (!targetEvent) {
        return NextResponse.json(
          {
            error: "Event not found",
            debug: {
              eventId,
              queriedUrl: backendUrl,
              availableEvents: (data.results || [])
                .slice(0, 10)
                .map((e: any) => ({
                  uuid: e.uuid,
                  title: e.title,
                  slug: slugify(e.title || ""),
                })),
            },
          },
          { status: 404 }
        );
      }
    }

    // Add source information based on event type
    // Check if event has clubs (club event) or unions/departments (campus event)
    let source = eventType;
    if (eventType === "campus" || eventType === "club") {
      source = eventType;
    } else {
      // Auto-detect based on event data
      const hasClubs = targetEvent.clubs && targetEvent.clubs.length > 0;
      const hasUnionsOrDepartments =
        (targetEvent.unions && targetEvent.unions.length > 0) ||
        (targetEvent.departments && targetEvent.departments.length > 0);

      if (hasClubs && !hasUnionsOrDepartments) {
        source = "club";
      } else {
        source = "campus";
      }
    }

    // Transform the event data to ensure proper field mapping
    const eventData = {
      ...targetEvent,
      source: source,
      // Map club name for club events
      clubName:
        source === "club" && targetEvent.clubs?.length > 0
          ? targetEvent.clubs[0].name
          : targetEvent.clubName || "Student Club",
      // Ensure date fields are properly mapped
      date: targetEvent.eventStartDate || targetEvent.date,
      eventStartDate: targetEvent.eventStartDate,
      eventEndDate: targetEvent.eventEndDate,
      // Ensure location is included
      location: targetEvent.location,
      // Map registration link
      registrationLink: targetEvent.registrationLink,
      // Ensure thumbnail is available
      thumbnail: targetEvent.thumbnail,
      // Map description fields
      description: targetEvent.description,
      descriptionShort: targetEvent.descriptionShort,
      descriptionDetailed: targetEvent.descriptionDetailed,
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
