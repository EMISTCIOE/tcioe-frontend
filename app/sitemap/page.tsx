import { AnimatedSection } from "@/components/animated-section";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Import the sitemap function to get all URLs
async function getAllSitemapUrls() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tcioe.edu.np";

  // Static routes organized by category
  const staticRoutes = {
    "Main Pages": [
      { url: "/", title: "Home", description: "Main homepage" },
      { url: "/about", title: "About", description: "About Thapathali Campus" },
      {
        url: "/academics",
        title: "Academics",
        description: "Academic programs and information",
      },
      {
        url: "/admissions",
        title: "Admissions",
        description: "Admission procedures and requirements",
      },
      {
        url: "/campus-life",
        title: "Campus Life",
        description: "Student life and activities",
      },
      {
        url: "/departments",
        title: "Departments",
        description: "Academic departments",
      },
      {
        url: "/research",
        title: "Research",
        description: "Research activities and centers",
      },
      {
        url: "/resources",
        title: "Resources",
        description: "Academic and student resources",
      },
    ],
    "About Sections": [
      {
        url: "/about/mission-vision",
        title: "Mission & Vision",
        description: "Our mission and vision statements",
      },
      {
        url: "/about/officials",
        title: "Officials",
        description: "College officials and administration",
      },
      {
        url: "/about/organization-chart",
        title: "Organization Chart",
        description: "Organizational structure",
      },
      {
        url: "/about/sections",
        title: "Sections",
        description: "Different sections of the college",
      },
      {
        url: "/about/units",
        title: "Units",
        description: "Various units and departments",
      },
    ],
    "Academic Programs": [
      {
        url: "/academics/undergraduate",
        title: "Undergraduate",
        description: "Bachelor's degree programs",
      },
      {
        url: "/academics/graduate",
        title: "Graduate",
        description: "Master's degree programs",
      },
      {
        url: "/academics/calendar",
        title: "Academic Calendar",
        description: "Academic calendar and schedule",
      },
    ],
    Admissions: [
      {
        url: "/admissions/undergraduate",
        title: "Undergraduate Admissions",
        description: "UG admission procedures",
      },
      {
        url: "/admissions/graduate",
        title: "Graduate Admissions",
        description: "PG admission procedures",
      },
      {
        url: "/admissions/scholarships",
        title: "Scholarships",
        description: "Available scholarships",
      },
    ],
    Departments: [
      {
        url: "/departments/applied-science",
        title: "Applied Science",
        description: "Applied Science Department",
      },
      {
        url: "/departments/architecture",
        title: "Architecture",
        description: "Architecture Department",
      },
      {
        url: "/departments/automobile-mechanical",
        title: "Automobile & Mechanical",
        description: "Automobile & Mechanical Engineering",
      },
      {
        url: "/departments/civil",
        title: "Civil Engineering",
        description: "Civil Engineering Department",
      },
      {
        url: "/departments/electronics-computer",
        title: "Electronics & Computer",
        description: "Electronics & Computer Engineering",
      },
      {
        url: "/departments/industrial",
        title: "Industrial Engineering",
        description: "Industrial Engineering Department",
      },
    ],
    "Campus Life": [
      {
        url: "/campus-life/clubs",
        title: "Clubs",
        description: "Student clubs and societies",
      },
      {
        url: "/campus-life/club-events",
        title: "Club Events",
        description: "Events organized by clubs",
      },
      {
        url: "/campus-life/festivals",
        title: "Festivals",
        description: "College festivals and celebrations",
      },
      {
        url: "/campus-life/unions",
        title: "Student Unions",
        description: "Student union activities",
      },
    ],
    Research: [
      {
        url: "/research/areas",
        title: "Research Areas",
        description: "Key research focus areas",
      },
      {
        url: "/research/centers",
        title: "Research Centers",
        description: "Research centers and labs",
      },
      {
        url: "/research/publications",
        title: "Publications",
        description: "Research publications",
      },
    ],
    Resources: [
      {
        url: "/resources/academic-calendar",
        title: "Academic Calendar",
        description: "Academic schedules",
      },
      {
        url: "/resources/campus-reports",
        title: "Campus Reports",
        description: "Official campus reports",
      },
      {
        url: "/resources/code-of-conduct",
        title: "Code of Conduct",
        description: "Student and staff guidelines",
      },
      {
        url: "/resources/downloads",
        title: "Downloads",
        description: "Downloadable resources",
      },
      {
        url: "/resources/magazines",
        title: "Magazines",
        description: "College magazines and publications",
      },
      {
        url: "/resources/tu-act-rules",
        title: "TU Act & Rules",
        description: "Tribhuvan University rules",
      },
    ],
    "Information Pages": [
      {
        url: "/events",
        title: "Events",
        description: "Upcoming and past events",
      },
      {
        url: "/notices",
        title: "Notices",
        description: "Official notices and announcements",
      },
      {
        url: "/downloads",
        title: "Downloads",
        description: "Files and documents",
      },
      { url: "/gallery", title: "Gallery", description: "Photo gallery" },
      {
        url: "/directory",
        title: "Directory",
        description: "Staff and contact directory",
      },
      { url: "/reports", title: "Reports", description: "Official reports" },
      {
        url: "/examination-board",
        title: "Examination Board",
        description: "Examination information",
      },
      {
        url: "/campus-map",
        title: "Campus Map",
        description: "Interactive campus map",
      },
    ],
    Utilities: [
      {
        url: "/suggestion-box",
        title: "Suggestion Box",
        description: "Submit suggestions and feedback",
      },
      {
        url: "/accessibility",
        title: "Accessibility",
        description: "Accessibility features",
      },
      {
        url: "/privacy-policy",
        title: "Privacy Policy",
        description: "Privacy policy and data protection",
      },

      {
        url: "/sitemap",
        title: "Sitemap",
        description: "This page - complete site structure",
      },
    ],
  };

  // Dynamic routes that would be fetched from APIs
  const dynamicRoutes = {
    "Dynamic Content": [
      {
        url: "/events/[id]",
        title: "Event Details",
        description: "Individual event pages",
      },
      {
        url: "/notices/[id]",
        title: "Notice Details",
        description: "Individual notice pages",
      },
      {
        url: "/campus-life/clubs/[id]",
        title: "Club Details",
        description: "Individual club pages",
      },
      {
        url: "/campus-life/club-events/[id]",
        title: "Club Event Details",
        description: "Individual club event pages",
      },
      {
        url: "/campus-life/festivals/[id]",
        title: "Festival Details",
        description: "Individual festival pages",
      },
      {
        url: "/campus-life/unions/[id]",
        title: "Union Details",
        description: "Individual union pages",
      },
    ],
  };

  return { staticRoutes, dynamicRoutes };
}

export default async function SitemapPage() {
  const { staticRoutes, dynamicRoutes } = await getAllSitemapUrls();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-blue mb-4">
            Website Sitemap
          </h1>
          <p className="text-lg md:text-xl text-text-dark max-w-3xl mx-auto">
            Complete overview of all pages and sections on the Thapathali Campus
            website. Use this sitemap to navigate to any page quickly.
          </p>
        </AnimatedSection>

        {/* XML Sitemap Link */}
        <AnimatedSection className="text-center mb-8">
          <Card className="inline-block">
            <CardContent className="p-4">
              <p className="text-sm text-text-dark mb-2">
                For search engines and automated tools:
              </p>
              <Link
                href="/sitemap.xml"
                className="text-primary-blue hover:text-blue-700 font-medium underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View XML Sitemap →
              </Link>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Static Routes */}
        <div className="space-y-8">
          {Object.entries(staticRoutes).map(([category, routes]) => (
            <AnimatedSection key={category}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-primary-blue">
                    {category}
                  </CardTitle>
                  <CardDescription>
                    {category === "Main Pages" && "Core pages of the website"}
                    {category === "About Sections" &&
                      "Information about the college"}
                    {category === "Academic Programs" &&
                      "Educational offerings and schedules"}
                    {category === "Admissions" &&
                      "Admission related information"}
                    {category === "Departments" &&
                      "Academic departments and faculties"}
                    {category === "Campus Life" &&
                      "Student activities and organizations"}
                    {category === "Research" &&
                      "Research initiatives and publications"}
                    {category === "Resources" &&
                      "Academic and administrative resources"}
                    {category === "Information Pages" &&
                      "News, events, and announcements"}
                    {category === "Utilities" &&
                      "Website utilities and policies"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {routes.map((route) => (
                      <Link
                        key={route.url}
                        href={route.url}
                        className="block p-4 border border-gray-200 rounded-lg hover:border-primary-blue hover:shadow-md transition-all duration-200 group"
                      >
                        <h3 className="font-semibold text-primary-blue group-hover:text-blue-700 mb-1">
                          {route.title}
                        </h3>
                        <p className="text-sm text-text-dark">
                          {route.description}
                        </p>
                        <div className="text-xs text-gray-500 mt-2 font-mono">
                          {route.url}
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}

          {/* Dynamic Routes */}
          {Object.entries(dynamicRoutes).map(([category, routes]) => (
            <AnimatedSection key={category}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-primary-blue">
                    {category}
                  </CardTitle>
                  <CardDescription>
                    Pages generated dynamically from database content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {routes.map((route) => (
                      <div
                        key={route.url}
                        className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <h3 className="font-semibold text-gray-700 mb-1">
                          {route.title}
                        </h3>
                        <p className="text-sm text-text-dark">
                          {route.description}
                        </p>
                        <div className="text-xs text-gray-500 mt-2 font-mono">
                          {route.url}
                        </div>
                        <div className="text-xs text-orange-600 mt-1">
                          ★ Dynamic content
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        {/* Footer Information */}
        <AnimatedSection className="mt-12 text-center">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-primary-blue mb-4">
                About This Sitemap
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-text-dark">
                <div>
                  <h4 className="font-semibold mb-2">Static Pages</h4>
                  <p>
                    Fixed pages with consistent URLs that provide core
                    information about the college and its services.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Dynamic Content</h4>
                  <p>
                    Pages generated from database content like events, notices,
                    and club information. URLs change based on content.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">XML Sitemap</h4>
                  <p>
                    Machine-readable sitemap for search engines, automatically
                    updated with latest content and optimal SEO settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
}
