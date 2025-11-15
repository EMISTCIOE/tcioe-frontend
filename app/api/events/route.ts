import { NextRequest, NextResponse } from "next/server";
import { camelCaseKeys } from "../utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://cdn.tcioe.edu.np";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const eventType = searchParams.get("type") || "all";
    const clubFilter = searchParams.get("club");
    const unionFilter = searchParams.get("union");

    const params = new URLSearchParams();

    const page = searchParams.get("page");
    const limit = searchParams.get("limit") || "10";

    if (page) {
      const offset = (parseInt(page) - 1) * parseInt(limit);
      params.append("offset", offset.toString());
    }

    if (limit) {
      params.append("limit", limit);
    }

    const search = searchParams.get("search");
    if (search) {
      params.append("search", search);
    }

    const campusEventType = searchParams.get("eventType");
    if (campusEventType) {
      params.append("eventType", campusEventType);
    }

    const clubParams = new URLSearchParams(params);
    const campusParams = new URLSearchParams(params);

    if (clubFilter) {
      clubParams.append("club", clubFilter);
    }
    if (unionFilter) {
      campusParams.append("union", unionFilter);
    }

    const onlyClub = Boolean(clubFilter);
    const onlyUnion = Boolean(unionFilter);
    const includeClubEvents =
      !onlyUnion && (eventType === "all" || eventType === "club" || onlyClub);
    const includeCampusEvents =
      !onlyClub && (eventType === "all" || eventType === "campus" || onlyUnion);

    let campusEvents = [];
    let clubEvents = [];
    let totalCount = 0;

    if (includeCampusEvents) {
      try {
        const campusUrl = `${API_BASE_URL}/api/v1/public/website-mod/global-events?${campusParams.toString()}`;
        const campusResponse = await fetch(campusUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          next: { revalidate: 300 },
        });

        if (campusResponse.ok) {
          const campusData = camelCaseKeys(await campusResponse.json()) as any;
          // Filter for campus/department/union events only (exclude club-only events)
          campusEvents = campusData.results
            .filter((event: any) => {
              // Include event if it has unions or departments
              // Exclude if it only has clubs (club-only events)
              const hasUnions = event.unions && event.unions.length > 0;
              const hasDepartments =
                event.departments && event.departments.length > 0;
              return hasUnions || hasDepartments;
            })
            .map((event: any) => ({
              ...event,
              source: "campus",
            }));
          if (eventType === "campus" || onlyUnion) {
            totalCount = campusEvents.length;
          }
        }
      } catch (error) {
        console.error("Error fetching campus events:", error);
      }
    }

    if (includeClubEvents) {
      try {
        const clubUrl = `${API_BASE_URL}/api/v1/public/website-mod/global-events?${clubParams.toString()}`;
        const clubResponse = await fetch(clubUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          next: { revalidate: 300 },
        });

        if (clubResponse.ok) {
          const clubData = camelCaseKeys(await clubResponse.json()) as any;
          // Filter for club events only (exclude events that have departments or unions)
          clubEvents = clubData.results
            .filter((event: any) => {
              // Include event if it has clubs
              const hasClubs = event.clubs && event.clubs.length > 0;
              // Exclude if it has departments or unions (those are campus/department events)
              const hasDepartments =
                event.departments && event.departments.length > 0;
              const hasUnions = event.unions && event.unions.length > 0;
              return hasClubs && !hasDepartments && !hasUnions;
            })
            .map((event: any) => ({
              ...event,
              source: "club",
            }));
          if (eventType === "club" || onlyClub) {
            totalCount = clubEvents.length;
          }
        }
      } catch (error) {
        console.error("Error fetching club events:", error);
      }
    }

    const shouldCombineResults = eventType === "all" && !onlyClub && !onlyUnion;
    let allEvents = [];

    if (shouldCombineResults) {
      allEvents = [...campusEvents, ...clubEvents];
      allEvents.sort((a, b) => {
        const dateA = new Date(a.eventStartDate || a.date);
        const dateB = new Date(b.eventStartDate || b.date);
        return dateB.getTime() - dateA.getTime();
      });

      totalCount = allEvents.length;

      const pageNum = parseInt(page || "1");
      const limitNum = parseInt(limit);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      allEvents = allEvents.slice(startIndex, endIndex);
    } else if (eventType === "campus" || onlyUnion) {
      allEvents = campusEvents;
    } else {
      allEvents = clubEvents;
    }

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

    return NextResponse.json(camelCaseKeys(response));
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
