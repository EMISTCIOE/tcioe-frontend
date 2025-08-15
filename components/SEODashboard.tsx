"use client";

import { useState, useEffect } from "react";
import {
  validateMetaDescription,
  validateTitle,
  validateHeadingStructure,
} from "@/lib/seo-utils";

interface SEOScore {
  score: number;
  issues: string[];
  recommendations: string[];
}

interface SEODashboardProps {
  url?: string;
  showDetails?: boolean;
}

export function SEODashboard({
  url = window.location.href,
  showDetails = false,
}: SEODashboardProps) {
  const [seoScore, setSeoScore] = useState<SEOScore>({
    score: 0,
    issues: [],
    recommendations: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzePage();
  }, [url]);

  const analyzePage = async () => {
    setLoading(true);

    try {
      const issues: string[] = [];
      const recommendations: string[] = [];
      let score = 100;

      // Check meta title
      const titleElement = document.querySelector("title");
      if (titleElement) {
        const titleValidation = validateTitle(titleElement.textContent || "");
        if (!titleValidation.isValid) {
          issues.push(`Title: ${titleValidation.message}`);
          score -= 10;
        }
      } else {
        issues.push("Missing title tag");
        score -= 20;
      }

      // Check meta description
      const descriptionElement = document.querySelector(
        'meta[name="description"]'
      );
      if (descriptionElement) {
        const description = descriptionElement.getAttribute("content") || "";
        const descValidation = validateMetaDescription(description);
        if (!descValidation.isValid) {
          issues.push(`Meta Description: ${descValidation.message}`);
          score -= 10;
        }
      } else {
        issues.push("Missing meta description");
        score -= 15;
      }

      // Check canonical URL
      const canonicalElement = document.querySelector('link[rel="canonical"]');
      if (!canonicalElement) {
        issues.push("Missing canonical URL");
        score -= 5;
      }

      // Check Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector(
        'meta[property="og:description"]'
      );
      const ogImage = document.querySelector('meta[property="og:image"]');

      if (!ogTitle) {
        issues.push("Missing Open Graph title");
        score -= 5;
      }
      if (!ogDescription) {
        issues.push("Missing Open Graph description");
        score -= 5;
      }
      if (!ogImage) {
        issues.push("Missing Open Graph image");
        score -= 5;
      }

      // Check Twitter Card tags
      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      if (!twitterCard) {
        issues.push("Missing Twitter Card");
        score -= 5;
      }

      // Check heading structure
      const bodyHTML = document.body.innerHTML;
      const headingValidation = validateHeadingStructure(bodyHTML);
      if (!headingValidation.isValid) {
        issues.push(
          ...headingValidation.issues.map((issue) => `Heading: ${issue}`)
        );
        score -= headingValidation.issues.length * 5;
      }

      // Check for alt text on images
      const images = document.querySelectorAll("img");
      const imagesWithoutAlt = Array.from(images).filter((img) => !img.alt);
      if (imagesWithoutAlt.length > 0) {
        issues.push(`${imagesWithoutAlt.length} images missing alt text`);
        score -= Math.min(imagesWithoutAlt.length * 2, 10);
      }

      // Check for structured data
      const structuredData = document.querySelectorAll(
        'script[type="application/ld+json"]'
      );
      if (structuredData.length === 0) {
        issues.push("No structured data found");
        score -= 10;
      }

      // Generate recommendations
      if (score < 80) {
        recommendations.push("Optimize meta title and description lengths");
      }
      if (score < 70) {
        recommendations.push("Add Open Graph and Twitter Card tags");
      }
      if (score < 60) {
        recommendations.push(
          "Improve heading structure and add alt text to images"
        );
      }
      if (score < 50) {
        recommendations.push("Add structured data and canonical URLs");
      }

      setSeoScore({
        score: Math.max(score, 0),
        issues,
        recommendations,
      });
    } catch (error) {
      console.error("Error analyzing page:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Good";
    if (score >= 60) return "Needs Improvement";
    return "Poor";
  };

  if (loading) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">SEO Analysis</h3>
        <button
          onClick={analyzePage}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
        >
          Refresh
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-2">
          <span className="text-2xl font-bold mr-2">{seoScore.score}</span>
          <span
            className={`text-sm font-medium ${getScoreColor(seoScore.score)}`}
          >
            {getScoreLabel(seoScore.score)}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              seoScore.score >= 80
                ? "bg-green-500"
                : seoScore.score >= 60
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${seoScore.score}%` }}
          ></div>
        </div>
      </div>

      {showDetails && (
        <>
          {seoScore.issues.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-red-700 mb-2">Issues Found:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {seoScore.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {seoScore.recommendations.length > 0 && (
            <div>
              <h4 className="font-medium text-blue-700 mb-2">
                Recommendations:
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {seoScore.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {seoScore.issues.length === 0 &&
            seoScore.recommendations.length === 0 && (
              <div className="text-green-600 text-sm">
                ✅ No major SEO issues found!
              </div>
            )}
        </>
      )}
    </div>
  );
}

export default SEODashboard;
