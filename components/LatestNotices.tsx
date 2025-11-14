import React from "react";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { useNotices } from "@/hooks/use-notices";
import {
  formatRelativeDate,
  getCategoryColor,
  extractTextFromHtml,
} from "@/lib/notices-utils";

export default function LatestNotices() {
  // Use the notices hook to fetch latest notices
  const { notices, loading, error } = useNotices({
    limit: 5,
    ordering: "-published_at",
  });

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest Notices
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-orange-500 mx-auto"></div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest Notices
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-orange-500 mx-auto"></div>
          </div>

          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              Unable to load notices at the moment.
            </p>
            <Link
              href="/notices"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Notices <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const displayNotices = notices?.slice(0, 3) || [];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Latest Notices
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-orange-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">
            Stay updated with our latest announcements and important information
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayNotices.map((notice) => {
            const departmentLabel = notice.department?.name ?? "College Wide";
            return (
              <div
                key={notice.uuid}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {notice.thumbnail && (
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${notice.thumbnail})` }}
                  >
                    <div className="h-full bg-black bg-opacity-20"></div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    {notice.category && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(
                          notice.category.name
                        )}`}
                      >
                        {notice.category.name}
                      </span>
                    )}
                    {notice.isFeatured && (
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium">
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {notice.title}
                  </h3>

                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatRelativeDate(notice.publishedAt)}</span>
                    <span className="mx-2">•</span>
                    <span className="truncate">{departmentLabel}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {extractTextFromHtml(notice.description)}
                  </p>

                  <Link
                    href={`/notices/${notice.slug}`}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm group"
                  >
                    Read More
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {notices && notices.length > 3 && (
          <div className="text-center mt-12">
            <Link
              href="/notices"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View All Notices <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
