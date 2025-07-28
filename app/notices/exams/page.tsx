'use client';

import { useState, useEffect } from 'react';
import { AnimatedSection } from "@/components/animated-section";
import { Calendar, Download, ExternalLink } from "lucide-react";
import Link from "next/link";

// Define the Notice type based on the API response
interface NoticeCategory {
  notice_type: string;
}

interface Department {
  department_name: string;
}

interface Notice {
  id: number;
  title: string;
  description: string;
  published_date?: string;
  publishedDate?: string; // Fallback for compatibility
  notice_category: NoticeCategory;
  department: Department;
  download_file?: string;
  pdfUrl?: string; // Fallback for compatibility
}

export default function ExamNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [noticesPerPage] = useState(5);
  const [noticesNotFound, setNoticesNotFound] = useState(false);
  
  // Helper functions
  const getNoticeCategory = (notice: Notice) => {
    return notice.notice_category?.notice_type || "General";
  };

  const getDepartmentName = (department: any) => {
    return department?.department_name || "All Departments";
  };

  // Calculate the tag color based on category
  const getTagColor = (category: string) => {
    switch(category) {
      case 'Exam': return 'bg-green-200 text-green-800';
      case 'Administration': return 'bg-red-200 text-red-800';
      case 'Scholarship': return 'bg-purple-200 text-purple-800';
      case 'Event': return 'bg-emerald-200 text-emerald-800';
      case 'Admission': return 'bg-blue-200 text-blue-800';
      case 'Department': return 'bg-yellow-200 text-yellow-800';
      case 'General': return 'bg-indigo-200 text-indigo-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  // Fetch exam notices from API
  const fetchExamNotices = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://notices.tcioe.edu.np/api/notice/notices/',
        { 
          cache: 'no-store',
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch notices: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Filter notices for "Exam" category
      const examNotices = data.filter((notice: any) => 
        notice.notice_category?.notice_type === "Exam"
      );
      
      setNotices(examNotices);
      setNoticesNotFound(examNotices.length === 0);
    } catch (error) {
      console.error('Error fetching exam notices:', error);
      setNotices([]);
      setNoticesNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchExamNotices();
  }, []);

  // Pagination logic
  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = notices.slice(indexOfFirstNotice, indexOfLastNotice);
  const totalPages = Math.ceil(notices.length / noticesPerPage);

  // Generate pagination numbers with ellipsis for long ranges
  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first and last page
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <AnimatedSection className="py-20 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-primary-blue mb-4">Exam Notices</h1>
        <p className="text-lg text-text-dark">Important notices regarding examinations.</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-10">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-center mt-4 text-gray-600">Loading exam notices...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && noticesNotFound && (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600">No exam notices found at the moment.</p>
        </div>
      )}

      {/* Notice List */}
      {!loading && !noticesNotFound && (
        currentNotices.map((notice) => (
          <div key={notice.id} className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
            <div className="text-gray-600 text-sm mb-1">
              {notice.published_date || notice.publishedDate} {notice.department && `| ${notice.department.department_name}`}
            </div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{notice.title}</h3>
                {notice.notice_category && (
                  <span className={`inline-block text-xs font-medium px-2 py-1 rounded mt-1 ${getTagColor(getNoticeCategory(notice))}`}>
                    {getNoticeCategory(notice)}
                  </span>
                )}
                <p className="text-gray-700 mt-2 text-sm">
                  {notice.description?.substring(0, 150)}
                  {notice.description?.length > 150 ? '...' : ''}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-2">
                {(notice.download_file || notice.pdfUrl) && (
                  <a 
                    href={notice.download_file || notice.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </a>
                )}
                <Link 
                  href={`/notices/${notice.id}`}
                  className="inline-flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Link>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      {!loading && notices.length > 0 && (
        <div className="flex justify-center mt-10 space-x-2">
          <button 
            className="border px-3 py-1 rounded-md bg-gray-100 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &lt;
          </button>
          
          {getPaginationNumbers().map((p, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded-md ${p === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
              onClick={() => typeof p === 'number' && setCurrentPage(p)}
            >
              {p}
            </button>
          ))}
          
          <button 
            className="border px-3 py-1 rounded-md bg-gray-100 disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            &gt;
          </button>
        </div>
      )}
    </AnimatedSection>
  )
}
