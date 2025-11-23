import type { Metadata } from "next";

export const siteConfig = {
  name: "Tribhuvan University Institute of Engineering, Thapathali Campus",
  description:
    "Official website for Tribhuvan University Institute of Engineering, Thapathali Campus. Providing quality engineering and architectural education since 1972.",
  url: process.env.NEXT_PUBLIC_BASE_URL || "https://tcioe.edu.np",
  ogImage: "/images/og-image.jpg",
  creator: "Thapathali Campus",
  keywords: [
    "Thapathali Campus",
    "IOE",
    "Tribhuvan University",
    "Engineering College Nepal",
    "Architecture Nepal",
    "Civil Engineering Nepal",
    "Computer Engineering Nepal",
    "Electronics Engineering Nepal",
    "Industrial Engineering Nepal",
    "Automobile Engineering Nepal",
    "Mechanical Engineering Nepal",
    "Applied Science Nepal",
    "Bachelor Engineering Nepal",
    "Master Engineering Nepal",
    "Engineering Education Nepal",
    "Technical Education Nepal",
    "Nepal Engineering University",
    "Engineering Courses Nepal",
    "BE Program Nepal",
    "ME Program Nepal",
    "Engineering Admission Nepal",
    "IOE Thapathali",
    "Thapathali Engineering College",
  ],
  authors: [
    {
      name: "Thapathali Campus",
      url: "https://tcioe.edu.np",
    },
  ],
};

export function createSEOConfig(
  title?: string,
  description?: string,
  keywords?: string[],
  image?: string,
  url?: string,
  type: "website" | "article" = "website"
): Metadata {
  const seoTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;

  const seoDescription = description || siteConfig.description;
  const seoImage = image || siteConfig.ogImage;
  const seoUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const seoKeywords = keywords
    ? [...siteConfig.keywords, ...keywords]
    : siteConfig.keywords;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    authors: siteConfig.authors,
    creator: siteConfig.creator,
    publisher: siteConfig.creator,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: seoUrl,
    },
    openGraph: {
      type,
      locale: "en_US",
      url: seoUrl,
      title: seoTitle,
      description: seoDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: seoImage,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [seoImage],
      creator: "@tcioe_official", // Update with actual Twitter handle
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION_ID,
      yandex: process.env.YANDEX_VERIFICATION_ID,
      other: {
        "msvalidate.01": process.env.BING_VERIFICATION_ID || "",
      },
    },
  };
}

// Department-specific SEO configurations
export const departmentSEOConfig = {
  "applied-science": {
    title: "Department of Applied Science",
    description:
      "Department of Applied Science at Thapathali Campus offers comprehensive foundation courses in physics, chemistry, and mathematics for engineering students.",
    keywords: [
      "Applied Science Nepal",
      "Engineering Physics Nepal",
      "Engineering Chemistry Nepal",
      "Engineering Mathematics Nepal",
    ],
  },
  architecture: {
    title: "Department of Architecture",
    description:
      "Department of Architecture at Thapathali Campus offers Bachelor of Architecture (B.Arch) program with focus on sustainable and innovative design.",
    keywords: [
      "Architecture Nepal",
      "B.Arch Nepal",
      "Architecture College Nepal",
      "Architectural Design Nepal",
    ],
  },
  "automobile-mechanical": {
    title: "Department of Automobile and Mechanical Engineering",
    description:
      "Department of Automobile and Mechanical Engineering offers BE and ME programs in automotive and mechanical engineering.",
    keywords: [
      "Automobile Engineering Nepal",
      "Mechanical Engineering Nepal",
      "Automotive Technology Nepal",
    ],
  },
  civil: {
    title: "Department of Civil Engineering",
    description:
      "Department of Civil Engineering at Thapathali Campus offers comprehensive programs in structural, environmental, and geotechnical engineering.",
    keywords: [
      "Civil Engineering Nepal",
      "Structural Engineering Nepal",
      "Environmental Engineering Nepal",
      "Geotechnical Engineering Nepal",
    ],
  },
  "electronics-computer": {
    title: "Department of Electronics and Computer Engineering",
    description:
      "Department of Electronics and Computer Engineering offers programs in computer engineering, electronics, and information technology.",
    keywords: [
      "Computer Engineering Nepal",
      "Electronics Engineering Nepal",
      "IT Education Nepal",
      "Software Engineering Nepal",
    ],
  },
  industrial: {
    title: "Department of Industrial Engineering",
    description:
      "Department of Industrial Engineering focuses on optimization, quality control, and industrial management systems.",
    keywords: [
      "Industrial Engineering Nepal",
      "Quality Control Nepal",
      "Industrial Management Nepal",
      "Operations Research Nepal",
    ],
  },
};

// Page-specific SEO configurations
export const pageSEOConfig = {
  about: {
    title: "About Us",
    description:
      "Learn about Thapathali Campus, the oldest engineering college in Nepal, established in 1972 under Tribhuvan University Institute of Engineering.",
    keywords: [
      "About Thapathali Campus",
      "IOE History",
      "Engineering Education History Nepal",
    ],
  },
  academics: {
    title: "Academics",
    description:
      "Explore undergraduate and graduate academic programs offered at Thapathali Campus including BE and ME degrees.",
    keywords: [
      "Academic Programs Nepal",
      "BE Programs Nepal",
      "ME Programs Nepal",
      "Engineering Curriculum Nepal",
    ],
  },
  admissions: {
    title: "Admissions",
    description:
      "Information about admissions process, entrance exams, scholarships, and requirements for undergraduate and graduate programs.",
    keywords: [
      "Engineering Admission Nepal",
      "IOE Entrance Exam",
      "Engineering College Admission Nepal",
      "Scholarships Nepal",
    ],
  },
  "campus-life": {
    title: "Campus Life",
    description:
      "Discover student life at Thapathali Campus including clubs, events, festivals, and student organizations.",
    keywords: [
      "Student Life Nepal",
      "Engineering Student Activities",
      "Campus Events Nepal",
      "Student Clubs Nepal",
    ],
  },
  research: {
    title: "Research",
    description:
      "Explore research areas, centers, and publications from Thapathali Campus faculty and students.",
    keywords: [
      "Engineering Research Nepal",
      "Research Publications Nepal",
      "Engineering Innovation Nepal",
    ],
  },
  events: {
    title: "Events",
    description:
      "Stay updated with latest events, seminars, workshops, and academic activities at Thapathali Campus.",
    keywords: [
      "Campus Events",
      "Engineering Seminars Nepal",
      "Technical Workshops Nepal",
      "Academic Events Nepal",
    ],
  },
  notices: {
    title: "Notices",
    description:
      "Official notices, announcements, and important updates from Thapathali Campus administration.",
    keywords: [
      "Campus Notices",
      "Official Announcements",
      "Academic Notifications Nepal",
    ],
  },
};

// Schema.org structured data generators
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: siteConfig.name,
    alternateName: ["Thapathali Campus", "IOE Thapathali", "TCIOE"],
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    image: `${siteConfig.url}/images/campus.jpg`,
    description: siteConfig.description,
    foundingDate: "1972",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Thapathali",
      addressLocality: "Kathmandu",
      addressRegion: "Bagmati",
      postalCode: "44600",
      addressCountry: "NP",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+977-1-4259555",
      contactType: "customer service",
      email: "info@tcioe.edu.np",
    },
    sameAs: [
      "https://www.facebook.com/tcioe.official",
      "https://twitter.com/tcioe_official",
      "https://www.linkedin.com/school/thapathali-campus",
      "https://www.youtube.com/channel/UCxxxxxxxx",
    ],
    department: [
      {
        "@type": "CollegeDepartment",
        name: "Department of Civil Engineering",
        url: `${siteConfig.url}/departments/civil`,
      },
      {
        "@type": "CollegeDepartment",
        name: "Department of Computer Engineering",
        url: `${siteConfig.url}/departments/electronics-computer`,
      },
      {
        "@type": "CollegeDepartment",
        name: "Department of Architecture",
        url: `${siteConfig.url}/departments/architecture`,
      },
      // Add more departments as needed
    ],
  };
}

export function generateEducationalOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    accreditationStatus: "Accredited by University Grants Commission, Nepal",
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "Bachelor of Engineering",
        educationalLevel: "Undergraduate",
        credentialCategory: "degree",
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "Master of Engineering",
        educationalLevel: "Graduate",
        credentialCategory: "degree",
      },
    ],
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

export function generateEventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    location: event.location
      ? {
          "@type": "Place",
          name: event.location,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Kathmandu",
            addressCountry: "NP",
          },
        }
      : undefined,
    organizer: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    url: `${siteConfig.url}${event.url}`,
  };
}
