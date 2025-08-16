"use client";

import { useState, useEffect } from "react";
import { usePostHog } from "@/components/PostHogAnalytics";

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: string;
  topPages: Array<{ page: string; views: number }>;
  topDepartments: Array<{ department: string; views: number }>;
  recentEvents: Array<{ event: string; timestamp: string; properties: any }>;
}

interface AnalyticsDashboardProps {
  showHeader?: boolean;
  timeRange?: "7d" | "30d" | "90d";
}

export function AnalyticsDashboard({
  showHeader = true,
  timeRange = "7d",
}: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "departments" | "events"
  >("overview");
  const { trackFeatureUsage } = usePostHog();

  useEffect(() => {
    trackFeatureUsage("analytics_dashboard", `time_range_${timeRange}`);
    fetchAnalyticsData();
  }, [timeRange, trackFeatureUsage]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockData: AnalyticsData = {
        pageViews: 15420,
        uniqueVisitors: 8230,
        avgSessionDuration: "4m 32s",
        topPages: [
          { page: "/", views: 3245 },
          { page: "/departments/civil", views: 1876 },
          { page: "/departments/computer", views: 1654 },
          { page: "/admissions", views: 1432 },
          { page: "/notices", views: 1198 },
        ],
        topDepartments: [
          { department: "Civil Engineering", views: 1876 },
          { department: "Computer Engineering", views: 1654 },
          { department: "Electronics Engineering", views: 1234 },
          { department: "Architecture", views: 987 },
          { department: "Mechanical Engineering", views: 856 },
        ],
        recentEvents: [
          {
            event: "department_view",
            timestamp: "2025-08-16T10:30:00Z",
            properties: { department_name: "Civil Engineering" },
          },
          {
            event: "file_download",
            timestamp: "2025-08-16T10:28:00Z",
            properties: { file_name: "syllabus.pdf", file_type: "pdf" },
          },
          {
            event: "form_submission",
            timestamp: "2025-08-16T10:25:00Z",
            properties: { form_name: "contact_form", success: true },
          },
        ],
      };

      setData(mockData);
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-gray-50 rounded">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <p className="text-red-600">Failed to load analytics data</p>
      </div>
    );
  }

  const StatCard = ({
    title,
    value,
    change,
  }: {
    title: string;
    value: string | number;
    change?: string;
  }) => (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {change && <p className="text-sm text-green-600 mt-1">↗ {change}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h2>
          <div className="flex space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Page Views"
          value={data.pageViews.toLocaleString()}
          change="+12.5%"
        />
        <StatCard
          title="Unique Visitors"
          value={data.uniqueVisitors.toLocaleString()}
          change="+8.3%"
        />
        <StatCard
          title="Avg. Session Duration"
          value={data.avgSessionDuration}
          change="+15.2%"
        />
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { key: "overview", label: "Overview" },
            { key: "departments", label: "Departments" },
            { key: "events", label: "Recent Events" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border shadow-sm">
        {activeTab === "overview" && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
            <div className="space-y-3">
              {data.topPages.map((page, index) => (
                <div
                  key={page.page}
                  className="flex justify-between items-center py-2"
                >
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center mr-3">
                      {index + 1}
                    </span>
                    <span className="font-medium">{page.page}</span>
                  </div>
                  <span className="text-gray-600">
                    {page.views.toLocaleString()} views
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "departments" && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Department Performance
            </h3>
            <div className="space-y-4">
              {data.topDepartments.map((dept, index) => (
                <div
                  key={dept.department}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <span className="font-medium">{dept.department}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {dept.views.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">views</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
            <div className="space-y-3">
              {data.recentEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-blue-600">
                      {event.event}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {Object.entries(event.properties).map(([key, value]) => (
                        <span key={key} className="mr-4">
                          {key}:{" "}
                          <span className="font-medium">{String(value)}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Analytics Platform Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="font-medium">Google Analytics</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Active - Tracking page views
          </p>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="font-medium">Microsoft Clarity</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Active - Recording sessions
          </p>
        </div>

        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span className="font-medium">PostHog</span>
          </div>
          <p className="text-sm text-purple-700 mt-1">
            Active - Event tracking
          </p>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
