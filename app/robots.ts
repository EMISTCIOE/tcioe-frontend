import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tcioe.edu.np";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/events", "/api/notices", "/api/clubs"],
        disallow: ["/api/feedback", "/admin/", "/private/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
