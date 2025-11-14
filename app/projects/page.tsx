"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Github, ExternalLink, Users, Calendar, Tag } from "lucide-react";

interface Project {
  id: number;
  title: string;
  abstract: string;
  description: string;
  project_type: string;
  status: string;
  department: string;
  supervisor_name: string;
  supervisor_email: string;
  start_date: string;
  end_date: string;
  academic_year: string;
  github_url: string;
  demo_url: string;
  technologies_used: string;
  is_featured: boolean;
  thumbnail: string;
  members: Array<{
    full_name: string;
    roll_number: string;
    role: string;
  }>;
  tags: Array<{
    name: string;
    color: string;
  }>;
  created_at: string;
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, selectedType, selectedStatus]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
        }/api/public/projects/`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      setProjects(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.technologies_used
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.supervisor_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(
        (project) => project.project_type === selectedType
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (project) => project.status === selectedStatus
      );
    }

    setFilteredProjects(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "final_year":
        return "bg-purple-100 text-purple-800";
      case "major":
        return "bg-orange-100 text-orange-800";
      case "minor":
        return "bg-cyan-100 text-cyan-800";
      case "research":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
            Error Loading Projects
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchProjects}
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
              Student Projects
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Explore innovative projects created by our talented students
              across various disciplines
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="final_year">Final Year</option>
                <option value="major">Major Project</option>
                <option value="minor">Minor Project</option>
                <option value="research">Research</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="container mx-auto px-4 py-8">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Project Thumbnail */}
                {project.thumbnail && (
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Project Type & Status */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                        project.project_type
                      )}`}
                    >
                      {project.project_type.replace("_", " ").toUpperCase()}
                    </span>
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>

                  {/* Project Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {project.title}
                  </h3>

                  {/* Abstract */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {project.abstract}
                  </p>

                  {/* Technologies */}
                  {project.technologies_used && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies_used
                          .split(",")
                          .slice(0, 3)
                          .map((tech, i) => (
                            <span
                              key={i}
                              className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        {project.technologies_used.split(",").length > 3 && (
                          <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{project.technologies_used.split(",").length - 3}{" "}
                            more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Team Info */}
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Users className="w-4 h-4 mr-1" />
                    <span>
                      {project.members.length} member
                      {project.members.length !== 1 ? "s" : ""}
                    </span>
                    {project.academic_year && (
                      <>
                        <span className="mx-2">•</span>
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{project.academic_year}</span>
                      </>
                    )}
                  </div>

                  {/* Supervisor */}
                  <div className="text-sm text-gray-600 mb-4">
                    <strong>Supervisor:</strong> {project.supervisor_name}
                  </div>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 2).map((tag, i) => (
                          <span
                            key={i}
                            className="inline-flex px-2 py-1 rounded text-xs font-medium text-white"
                            style={{ backgroundColor: tag.color }}
                          >
                            {tag.name}
                          </span>
                        ))}
                        {project.tags.length > 2 && (
                          <span className="inline-flex px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                            +{project.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Links */}
                  <div className="flex gap-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <Github className="w-4 h-4 mr-1" />
                        Code
                      </a>
                    )}
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProjectsPage;
