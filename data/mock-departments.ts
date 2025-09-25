import type {
  CampusEventGallery,
  DepartmentDetail,
  DepartmentEventsResponse,
  DepartmentProgramsResponse,
  DepartmentStaffsResponse,
  DepartmentsResponse,
  DownloadsResponse,
  DepartmentPlansResponse,
} from "@/types";

// Helpers
const makeId = (seed: string) => `uuid-${seed}`;

// Thumbnails and photos are taken from existing public assets where possible
const deptThumb = (slug: string) =>
  slug === "applied-science"
    ? "/placeholder-logo.png"
    : "/placeholder-logo.png";

export const mockDepartmentsList: DepartmentsResponse = {
  count: 6,
  next: null,
  previous: null,
  results: [
    {
      uuid: makeId("doas"),
      name: "Department of Applied Science",
      slug: "applied-science",
      shortName: "DAS",
      briefDescription:
        "Foundational sciences supporting all engineering disciplines.",
      thumbnail: "/data/logo.jpg",
    },
    {
      uuid: makeId("doarch"),
      name: "Department of Architecture",
      slug: "architecture",
      shortName: "DOArch",
      briefDescription: "Architecture, planning, design, and research.",
      thumbnail: "/data/logo.jpg",
    },
    {
      uuid: makeId("doame"),
      name: "Department of Automobile & Mechanical Engineering",
      slug: "automobile-mechanical",
      shortName: "DOAME",
      briefDescription: "Mechanical systems and automotive technologies.",
      thumbnail: "/data/logo.jpg",
    },
    {
      uuid: makeId("doce"),
      name: "Department of Civil Engineering",
      slug: "civil",
      shortName: "DOCE",
      briefDescription: "Infrastructure, structures and environment.",
      thumbnail: "/data/logo.jpg",
    },
    {
      uuid: makeId("doece"),
      name: "Department of Electronics & Computer Engineering",
      slug: "electronics-computer",
      shortName: "DOECE",
      briefDescription: "Electronics, communication and computing.",
      thumbnail: "/data/logo.jpg",
    },
    {
      uuid: makeId("doie"),
      name: "Department of Industrial Engineering",
      slug: "industrial",
      shortName: "DOIE",
      briefDescription: "Optimization of systems and processes.",
      thumbnail: "/data/logo.jpg",
    },
  ],
};

export function getMockDepartmentDetail(slug: string): DepartmentDetail {
  const base = mockDepartmentsList.results.find((d) => d.slug === slug);
  return {
    uuid: base?.uuid || makeId(slug),
    name: base?.name || `Department: ${slug}`,
    slug,
    shortName: base?.shortName || slug.toUpperCase().slice(0, 4),
    briefDescription:
      base?.briefDescription ||
      "This department fosters excellence in teaching, research and innovation across multiple focus areas.",
    detailedDescription:
      "We provide a supportive academic environment with experienced faculty, modern labs and industry collaborations.",
    phoneNo: "+977-1-4259555",
    email: "info@tcioe.edu.np",
    thumbnail: base?.thumbnail || deptThumb(slug),
    socialLinks: [
      { uuid: makeId("fb"), platform: "FACEBOOK", url: "https://facebook.com" },
    ],
  };
}

export function getMockDepartmentPrograms(
  slug: string
): DepartmentProgramsResponse {
  const items = [
    {
      uuid: makeId(`${slug}-prog-1`),
      name: "Bachelor of Engineering",
      shortName: "BE",
      slug: "be-general",
      description:
        "Undergraduate engineering program focusing on fundamentals and applied skills.",
      programType: "BACHELORS" as const,
      thumbnail: "/placeholder.jpg",
    },
    {
      uuid: makeId(`${slug}-prog-2`),
      name: "Bachelor of Engineering",
      shortName: "BE",
      slug: "be-gensdkdjs",
      description:
        "Undergraduate engineering program focusing on fundamentals and applied skills.",
      programType: "BACHELORS" as const,
      thumbnail: "/placeholder.jpg",
    },
    {
      uuid: makeId(`${slug}-prog-2`),
      name: "Master of Engineering",
      shortName: "ME",
      slug: "me-advanced",
      description:
        "Graduate program emphasizing research, design and innovation.",
      programType: "MASTERS" as const,
      thumbnail: "/placeholder.jpg",
    },
  ];
  return { count: items.length, next: null, previous: null, results: items };
}

export function getMockDepartmentStaffs(
  slug: string
): DepartmentStaffsResponse {
  const items = Array.from({ length: 6 }).map((_, i) => ({
    uuid: makeId(`${slug}-staff-${i + 1}`),
    title: i % 3 === 0 ? "Dr." : i % 3 === 1 ? "Er." : "Ar.",
    name: `Faculty Member ${i + 1}`,
    designation: i === 0 ? "HOD" : "Lecturer",
    photo: "/placeholder-user.jpg",
    phoneNumber: "+977-1-4259555",
    email: `member${i + 1}@tcioe.edu.np`,
    message: "Committed to academic excellence.",
    displayOrder: i + 1,
  }));
  return { count: items.length, next: null, previous: null, results: items };
}

export function getMockDepartmentEvents(
  slug: string
): DepartmentEventsResponse {
  const items = [
    {
      uuid: makeId(`${slug}-event-1`),
      title: "Orientation Program",
      descriptionShort: "Welcome event for new students.",
      eventType: "ACADEMIC" as const,
      eventStartDate: "2025-10-15",
      eventEndDate: "2025-10-15",
      thumbnail: "/placeholder.jpg",
    },
    {
      uuid: makeId(`${slug}-event-2`),
      title: "Tech Talk Series",
      descriptionShort: "Industry expert session.",
      eventType: "TECHNICAL" as const,
      eventStartDate: "2025-11-01",
      eventEndDate: "2025-11-01",
      thumbnail: "/placeholder.jpg",
    },
  ];
  return { count: items.length, next: null, previous: null, results: items };
}

export function getMockDepartmentDownloads(slug: string): DownloadsResponse {
  const items = [
    {
      uuid: makeId(`${slug}-down-1`),
      title: "Department Brochure",
      description: "Overview of programs and facilities.",
      file: "/placeholder.pdf",
      createdAt: "2025-01-01",
    },
  ];
  return { count: items.length, next: null, previous: null, results: items };
}

export function getMockDepartmentPlans(slug: string): DepartmentPlansResponse {
  const items = [
    {
      uuid: makeId(`${slug}-plan-1`),
      title: "Strategic Plan 2025",
      description: "Goals and initiatives for the academic year.",
      file: "/placeholder.pdf",
      createdAt: "2025-01-01",
    },
  ];
  return {
    count: items.length,
    next: null,
    previous: null,
    results: items,
  } as DepartmentPlansResponse;
}

export function getMockDepartmentEventGallery(eventId: string | number) {
  const results: CampusEventGallery[] = Array.from({ length: 6 }).map(
    (_, i) => ({
      uuid: makeId(`gal-${eventId}-${i}`),
      image: "/placeholder.jpg",
      caption: `Event image ${i + 1}`,
    })
  );
  return { count: results.length, next: null, previous: null, results };
}
