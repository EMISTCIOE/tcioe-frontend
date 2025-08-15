import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tcioe.edu.np";

// Static routes configuration
const staticRoutes = [
  {
    url: "",
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1.0,
  },
  {
    url: "/about",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  },
  {
    url: "/about/mission-vision",
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.8,
  },
  {
    url: "/about/officials",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    url: "/about/organization-chart",
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  },
  {
    url: "/about/sections",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    url: "/about/units",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    url: "/academics",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  },
  {
    url: "/academics/calendar",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  },
  {
    url: "/academics/graduate",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    url: "/academics/undergraduate",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    url: "/admissions",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  },
  {
    url: "/admissions/graduate",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    url: "/admissions/undergraduate",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    url: "/admissions/scholarships",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    url: "/campus-life",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  },
  {
    url: "/campus-life/clubs",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  },
  {
    url: "/campus-life/club-events",
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  },
  {
    url: "/campus-life/festivals",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  },
  {
    url: "/campus-life/unions",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  },
  {
    url: "/campus-map",
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  },
  {
    url: "/departments",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    url: "/departments/applied-science",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    url: "/departments/architecture",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    url: "/departments/automobile-mechanical",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    url: "/departments/civil",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    url: "/departments/electronics-computer",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    url: "/departments/industrial",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    url: "/directory",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  },
  {
    url: "/downloads",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  },
  {
    url: "/events",
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  },
  {
    url: "/examination-board",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  },
  {
    url: "/gallery",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  },
  {
    url: "/notices",
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  },
  {
    url: "/research",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    url: "/research/areas",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    url: "/research/centers",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    url: "/research/publications",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  },
  {
    url: "/resources",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  },
  {
    url: "/resources/academic-calendar",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    url: "/resources/campus-reports",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  },
  {
    url: "/resources/code-of-conduct",
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  },
  {
    url: "/resources/downloads",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  },
  {
    url: "/resources/magazines",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  },
  {
    url: "/resources/tu-act-rules",
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  },
  {
    url: "/reports",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  },
  {
    url: "/suggestion-box",
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.4,
  },
  {
    url: "/accessibility",
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.3,
  },
  {
    url: "/privacy-policy",
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.3,
  },
  {
    url: "/terms-of-use",
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.3,
  },
];

async function getDynamicRoutes() {
  const dynamicRoutes: Array<{
    url: string;
    lastModified: Date;
    changeFrequency:
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never";
    priority: number;
  }> = [];

  try {
    // Fetch dynamic events
    const eventsResponse = await fetch(`${baseUrl}/api/events`, {
      next: { revalidate: 3600 },
    });
    if (eventsResponse.ok) {
      const events = await eventsResponse.json();
      events.forEach((event: any) => {
        dynamicRoutes.push({
          url: `/events/${event.id}`,
          lastModified: new Date(event.updatedAt || event.createdAt),
          changeFrequency: "weekly",
          priority: 0.6,
        });
      });
    }
  } catch (error) {
    console.warn("Failed to fetch events for sitemap:", error);
  }

  try {
    // Fetch dynamic notices
    const noticesResponse = await fetch(`${baseUrl}/api/notices`, {
      next: { revalidate: 3600 },
    });
    if (noticesResponse.ok) {
      const notices = await noticesResponse.json();
      notices.forEach((notice: any) => {
        dynamicRoutes.push({
          url: `/notices/${notice.id}`,
          lastModified: new Date(notice.updatedAt || notice.createdAt),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      });
    }
  } catch (error) {
    console.warn("Failed to fetch notices for sitemap:", error);
  }

  try {
    // Fetch dynamic clubs
    const clubsResponse = await fetch(`${baseUrl}/api/clubs`, {
      next: { revalidate: 3600 },
    });
    if (clubsResponse.ok) {
      const clubs = await clubsResponse.json();
      clubs.forEach((club: any) => {
        dynamicRoutes.push({
          url: `/campus-life/clubs/${club.id}`,
          lastModified: new Date(club.updatedAt || club.createdAt),
          changeFrequency: "monthly",
          priority: 0.5,
        });
      });
    }
  } catch (error) {
    console.warn("Failed to fetch clubs for sitemap:", error);
  }

  try {
    // Fetch dynamic club events
    const clubEventsResponse = await fetch(`${baseUrl}/api/events?type=club`, {
      next: { revalidate: 3600 },
    });
    if (clubEventsResponse.ok) {
      const clubEvents = await clubEventsResponse.json();
      clubEvents.forEach((event: any) => {
        dynamicRoutes.push({
          url: `/campus-life/club-events/${event.id}`,
          lastModified: new Date(event.updatedAt || event.createdAt),
          changeFrequency: "weekly",
          priority: 0.5,
        });
      });
    }
  } catch (error) {
    console.warn("Failed to fetch club events for sitemap:", error);
  }

  try {
    // Fetch dynamic festivals
    const festivalsResponse = await fetch(
      `${baseUrl}/api/events?type=festival`,
      { next: { revalidate: 3600 } }
    );
    if (festivalsResponse.ok) {
      const festivals = await festivalsResponse.json();
      festivals.forEach((festival: any) => {
        dynamicRoutes.push({
          url: `/campus-life/festivals/${festival.id}`,
          lastModified: new Date(festival.updatedAt || festival.createdAt),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      });
    }
  } catch (error) {
    console.warn("Failed to fetch festivals for sitemap:", error);
  }

  try {
    // Fetch dynamic unions
    const unionsResponse = await fetch(`${baseUrl}/api/unions`, {
      next: { revalidate: 3600 },
    });
    if (unionsResponse.ok) {
      const unions = await unionsResponse.json();
      unions.forEach((union: any) => {
        dynamicRoutes.push({
          url: `/campus-life/unions/${union.id}`,
          lastModified: new Date(union.updatedAt || union.createdAt),
          changeFrequency: "monthly",
          priority: 0.5,
        });
      });
    }
  } catch (error) {
    console.warn("Failed to fetch unions for sitemap:", error);
  }

  return dynamicRoutes;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicRoutes = await getDynamicRoutes();

  const allRoutes = [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route.url}`,
      lastModified: route.lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...dynamicRoutes.map((route) => ({
      url: `${baseUrl}${route.url}`,
      lastModified: route.lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
  ];

  return allRoutes;
}
