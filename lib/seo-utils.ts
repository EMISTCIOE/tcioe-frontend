/**
 * SEO Utilities for common SEO tasks
 */

// Generate a URL-friendly slug from a string
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Truncate text to a specific length for meta descriptions
export function truncateText(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex === -1) return truncated + "...";
  return truncated.slice(0, lastSpaceIndex) + "...";
}

// Extract excerpt from content
export function extractExcerpt(
  content: string,
  maxLength: number = 160
): string {
  // Remove HTML tags
  const textOnly = content.replace(/<[^>]*>/g, "");
  // Remove extra whitespace
  const cleanText = textOnly.replace(/\s+/g, " ").trim();

  return truncateText(cleanText, maxLength);
}

// Generate keywords from content
export function generateKeywords(
  content: string,
  baseKeywords: string[] = [],
  maxKeywords: number = 10
): string[] {
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3);

  // Count word frequency
  const wordCount: Record<string, number> = {};
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // Sort by frequency and take top words
  const topWords = Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords - baseKeywords.length)
    .map(([word]) => word);

  return [...baseKeywords, ...topWords];
}

// Validate meta description length
export function validateMetaDescription(description: string): {
  isValid: boolean;
  length: number;
  message: string;
} {
  const length = description.length;

  if (length < 120) {
    return {
      isValid: false,
      length,
      message: "Meta description is too short. Aim for 120-160 characters.",
    };
  }

  if (length > 160) {
    return {
      isValid: false,
      length,
      message: "Meta description is too long. Keep it under 160 characters.",
    };
  }

  return {
    isValid: true,
    length,
    message: "Meta description length is optimal.",
  };
}

// Validate title length
export function validateTitle(title: string): {
  isValid: boolean;
  length: number;
  message: string;
} {
  const length = title.length;

  if (length < 30) {
    return {
      isValid: false,
      length,
      message: "Title is too short. Aim for 30-60 characters.",
    };
  }

  if (length > 60) {
    return {
      isValid: false,
      length,
      message: "Title is too long. Keep it under 60 characters.",
    };
  }

  return {
    isValid: true,
    length,
    message: "Title length is optimal.",
  };
}

// Generate breadcrumb items from pathname
export function generateBreadcrumbs(
  pathname: string
): Array<{ name: string; url: string }> {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [{ name: "Home", url: "/" }];

  let currentPath = "";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Convert slug to readable name
    const name = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    breadcrumbs.push({
      name,
      url: currentPath,
    });
  });

  return breadcrumbs;
}

// Check if URL is external
export function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname !== window.location.hostname;
  } catch {
    return false;
  }
}

// Generate canonical URL
export function generateCanonicalUrl(
  pathname: string,
  baseUrl?: string
): string {
  const base =
    baseUrl || process.env.NEXT_PUBLIC_BASE_URL || "https://tcioe.edu.np";
  return `${base}${pathname}`;
}

// Clean URL parameters for SEO
export function cleanUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Remove common tracking parameters
    const paramsToRemove = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "fbclid",
      "gclid",
    ];

    paramsToRemove.forEach((param) => {
      urlObj.searchParams.delete(param);
    });

    return urlObj.toString();
  } catch {
    return url;
  }
}

// Generate Open Graph image URL
export function generateOGImageUrl(
  title: string,
  subtitle?: string,
  logo?: string
): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tcioe.edu.np";
  const params = new URLSearchParams({
    title: title,
    ...(subtitle && { subtitle }),
    ...(logo && { logo }),
  });

  return `${baseUrl}/api/og?${params.toString()}`;
}

// Format date for structured data
export function formatDateForSchema(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toISOString();
}

// Extract reading time from content
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Generate FAQ schema from Q&A data
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Check if content has proper heading structure
export function validateHeadingStructure(htmlContent: string): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Extract headings
  const headingMatches = htmlContent.match(/<h[1-6][^>]*>/g) || [];
  const headings = headingMatches.map((h) => {
    const level = parseInt(h.match(/h([1-6])/)?.[1] || "1");
    return level;
  });

  // Check for H1
  if (!headings.includes(1)) {
    issues.push("Missing H1 tag");
  }

  // Check for multiple H1s
  if (headings.filter((h) => h === 1).length > 1) {
    issues.push("Multiple H1 tags found");
  }

  // Check for proper hierarchy
  for (let i = 1; i < headings.length; i++) {
    const current = headings[i];
    const previous = headings[i - 1];

    if (current > previous + 1) {
      issues.push(
        `Heading hierarchy issue: H${previous} followed by H${current}`
      );
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}
