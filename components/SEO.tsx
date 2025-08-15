import { Metadata } from "next";
import { createSEOConfig, generateBreadcrumbSchema } from "@/lib/seo";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  noindex?: boolean;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export function generateSEOMetadata({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  noindex = false,
}: SEOProps): Metadata {
  const baseMetadata = createSEOConfig(
    title,
    description,
    keywords,
    image,
    url,
    type
  );

  if (noindex) {
    baseMetadata.robots = {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    };
  }

  return baseMetadata;
}

interface PageSEOProps extends SEOProps {
  children?: React.ReactNode;
}

export function PageSEO({ breadcrumbs, children }: PageSEOProps) {
  let structuredData = [];

  if (breadcrumbs && breadcrumbs.length > 0) {
    structuredData.push(generateBreadcrumbSchema(breadcrumbs));
  }

  return (
    <>
      {structuredData.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      {children}
    </>
  );
}
