"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Github,
  ExternalLink,
  Users,
  Calendar,
  BookOpen,
  Award,
  Database,
  Globe,
} from "lucide-react";

interface Research {
  id: number;
  title: string;
  abstract: string;
  description: string;
  research_type: string;
  status: string;
  field_of_study: string;
  keywords: string;
  methodology: string;
  start_date: string;
  end_date: string;
  duration_months: number;
  funding_agency: string;
  funding_amount: number;
  funding_currency: string;
  expected_outcomes: string;
  is_collaborative: boolean;
  collaboration_details: string;
  github_url: string;
  dataset_url: string;
  website_url: string;
  is_featured: boolean;
  citation_count: number;
  participants: Array<{
    full_name: string;
    participant_type: string;
    role: string;
    affiliation: string;
  }>;
  publications: Array<{
    title: string;
    authors: string;
    journal_name: string;
    conference_name: string;
    publication_date: string;
    doi: string;
    url: string;
    citation_count: number;
  }>;
  tags: Array<{
    name: string;
    color: string;
  }>;
  created_at: string;
}

export default function ResearchPage() {
  const [research, setResearch] = useState<Research[]>([]);
  const [filteredResearch, setFilteredResearch] = useState<Research[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedField, setSelectedField] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResearch();
  }, []);

  useEffect(() => {
    filterResearch();
  }, [research, searchTerm, selectedType, selectedStatus, selectedField]);

  const fetchResearch = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
        }/api/public/research/`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch research");
      }

      const data = await response.json();
      setResearch(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load research");
    } finally {
      setLoading(false);
    }
  };

  const filterResearch = () => {
    let filtered = research;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.field_of_study
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.keywords.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.participants.some((p) =>
            p.full_name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((item) => item.research_type === selectedType);
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }

    // Field filter
    if (selectedField !== "all") {
      filtered = filtered.filter((item) =>
        item.field_of_study.toLowerCase().includes(selectedField.toLowerCase())
      );
    }

    setFilteredResearch(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "published":
        return "bg-purple-100 text-purple-800";
      case "proposal":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "basic":
        return "bg-blue-100 text-blue-800";
      case "applied":
        return "bg-green-100 text-green-800";
      case "development":
        return "bg-orange-100 text-orange-800";
      case "interdisciplinary":
        return "bg-purple-100 text-purple-800";
      case "collaborative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: { [key: string]: string } = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    return `${symbols[currency] || currency} ${new Intl.NumberFormat(
      "en-IN"
    ).format(amount)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Research
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchResearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Research Projects
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover cutting-edge research initiatives and scholarly work from
              our institution
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search research..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="basic">Basic Research</option>
                <option value="applied">Applied Research</option>
                <option value="development">Development</option>
                <option value="interdisciplinary">Interdisciplinary</option>
                <option value="collaborative">Collaborative</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="proposal">Proposal</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="published">Published</option>
              </select>

              <input
                type="text"
                placeholder="Field of study..."
                value={selectedField === "all" ? "" : selectedField}
                onChange={(e) => setSelectedField(e.target.value || "all")}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredResearch.length} of {research.length} research
            projects
          </div>
        </div>
      </section>

      {/* Research Grid */}
      <section className="container mx-auto px-4 py-8">
        {filteredResearch.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No research found
            </h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredResearch.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  {/* Research Type & Status */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                        item.research_type
                      )}`}
                    >
                      {item.research_type.replace("_", " ").toUpperCase()}
                    </span>
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Research Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Field of Study */}
                  <div className="text-sm text-blue-600 font-medium mb-3">
                    {item.field_of_study}
                  </div>

                  {/* Abstract */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {item.abstract}
                  </p>

                  {/* Keywords */}
                  {item.keywords && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {item.keywords
                          .split(",")
                          .slice(0, 4)
                          .map((keyword, i) => (
                            <span
                              key={i}
                              className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {keyword.trim()}
                            </span>
                          ))}
                        {item.keywords.split(",").length > 4 && (
                          <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{item.keywords.split(",").length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Research Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>
                        {item.participants.length} participant
                        {item.participants.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {item.duration_months && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{item.duration_months} months</span>
                      </div>
                    )}

                    {item.publications.length > 0 && (
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        <span>
                          {item.publications.length} publication
                          {item.publications.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}

                    {item.citation_count > 0 && (
                      <div className="flex items-center">
                        <Award className="w-4 h-4 mr-1" />
                        <span>
                          {item.citation_count} citation
                          {item.citation_count !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Funding Info */}
                  {item.funding_agency && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <div className="text-sm">
                        <strong className="text-green-800">Funded by:</strong>{" "}
                        {item.funding_agency}
                        {item.funding_amount && (
                          <span className="ml-2 text-green-600 font-medium">
                            {formatCurrency(
                              item.funding_amount,
                              item.funding_currency
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Collaboration Badge */}
                  {item.is_collaborative && (
                    <div className="mb-4">
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        <Users className="w-3 h-3 mr-1" />
                        Collaborative Research
                      </span>
                    </div>
                  )}

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="inline-flex px-2 py-1 rounded text-xs font-medium text-white"
                            style={{ backgroundColor: tag.color }}
                          >
                            {tag.name}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="inline-flex px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                            +{item.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Principal Investigator */}
                  {item.participants.find((p) =>
                    p.role.toLowerCase().includes("principal")
                  ) && (
                    <div className="mb-4 text-sm text-gray-600">
                      <strong>Principal Investigator:</strong>{" "}
                      {
                        item.participants.find((p) =>
                          p.role.toLowerCase().includes("principal")
                        )?.full_name
                      }
                    </div>
                  )}

                  {/* Action Links */}
                  <div className="flex flex-wrap gap-2">
                    {item.github_url && (
                      <a
                        href={item.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <Github className="w-4 h-4 mr-1" />
                        Code
                      </a>
                    )}

                    {item.dataset_url && (
                      <a
                        href={item.dataset_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Database className="w-4 h-4 mr-1" />
                        Dataset
                      </a>
                    )}

                    {item.website_url && (
                      <a
                        href={item.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Globe className="w-4 h-4 mr-1" />
                        Website
                      </a>
                    )}
                  </div>

                  {/* Publications Preview */}
                  {item.publications.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Recent Publications
                      </h4>
                      <div className="space-y-2">
                        {item.publications.slice(0, 2).map((pub, i) => (
                          <div key={i} className="text-xs text-gray-600">
                            <div className="font-medium">{pub.title}</div>
                            <div>{pub.authors}</div>
                            {pub.journal_name && (
                              <div className="italic">{pub.journal_name}</div>
                            )}
                            {pub.conference_name && (
                              <div className="italic">
                                {pub.conference_name}
                              </div>
                            )}
                          </div>
                        ))}
                        {item.publications.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{item.publications.length - 2} more publications
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
