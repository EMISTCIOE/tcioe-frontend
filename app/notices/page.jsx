'use client';

import { useState, useEffect } from 'react';
import { AnimatedSection } from "@/components/animated-section";
import { Search, Calendar, Download, ExternalLink } from "lucide-react";
import Link from "next/link";

const typedata = [
  {
    id: 1,
    notice_type: "Administration",
  },
  {
    id: 2,
    notice_type: "Admission",
  },
  {
    id: 3,
    notice_type: "Exam",
  },
  {
    id: 4,
    notice_type: "Scholarship",
  },
  {
    id: 5,
    notice_type: "Department",
  },
  {
    id: 6,
    notice_type: "Event",
  },
  {
    id: 7,
    notice_type: "General",
  },
];

const departmentdata = [
  {
    id: 1,
    department_name: "Applied Science",
  },
  {
    id: 2,
    department_name: "Automobile & Mechanical",
  },
  {
    id: 3,
    department_name: "Architecture",
  },
  {
    id: 4,
    department_name: "Civil Engineering",
  },
  {
    id: 5,
    department_name: "Electronics & Computer Engineering",
  },
  {
    id: 6,
    department_name: "Industrial Engineering",
  },
];

export default function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [noticesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [noticesNotFound, setNoticesNotFound] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Helper functions
  const getNoticeCategory = (notice) => {
    return notice.notice_category?.notice_type || "General";
  };

  const getDepartmentName = (department) => {
    return department || "All Departments";
  };

  // Calculate the tag color based on category
  const getTagColor = (category) => {
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

  // Fetch notices from API
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://notices.tcioe.edu.np/api/notice/notices/',
        { 
          cache: 'default', // Use browser's default caching strategy
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch notices: ${response.status}`);
      }
      
      const data = await response.json();
      setNotices(data);
      setNoticesNotFound(data.length === 0);
      
      // Reset active filters
      setActiveFilters([]);
    } catch (error) {
      console.error('Error fetching notices:', error);
      setNotices([]);
      setNoticesNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    // Set null values to empty strings
    if (selectedDepartment === null) {
      setSelectedDepartment('');
    }
    
    if (selectedCategory === null) {
      setSelectedCategory('');
    }
    
    fetchNotices();
  }, []);

  // Effect to debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); // 1000ms (1 second) delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Effect to trigger search when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== '') {
      handleSearch();
    }
  }, [debouncedSearchTerm]);

  // Effect to handle initial load of active filters
  useEffect(() => {
    // Only update active filters if we have any active filters
    if (selectedCategory || selectedDepartment || searchTerm) {
      const newFilters = [];
      if (selectedCategory) newFilters.push(selectedCategory);
      if (selectedDepartment) newFilters.push(selectedDepartment);
      if (searchTerm) newFilters.push(`Search: ${searchTerm}`);
      
      setActiveFilters(newFilters);
    }
  }, []);

  // Search and filter functionality
  const handleSearch = async () => {
    setLoading(true);
    setCurrentPage(1);
    
    // If both department and category are null, set them to empty strings (All Departments/Categories)
    if (selectedDepartment === null) {
      setSelectedDepartment('');
    }
    
    if (selectedCategory === null) {
      setSelectedCategory('');
    }
    
    try {
      // API call based on whether search term exists
      const searchTermToUse = searchTerm.trim();
      const endpoint = searchTermToUse 
        ? `https://notices.tcioe.edu.np/api/notice/search/?keyword=${encodeURIComponent(searchTermToUse)}`
        : 'https://notices.tcioe.edu.np/api/notice/notices/';
      
      const response = await fetch(endpoint, { 
        cache: 'no-store',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch notices: ${response.status}`);
      }
      
      let data = await response.json();
      
      // Apply client-side filtering
      if (selectedCategory || selectedDepartment) {
        data = data.filter(notice => {
          // Check category filter
          const categoryMatch = !selectedCategory || 
            getNoticeCategory(notice) === selectedCategory;
          
          // Check department filter
          const departmentMatch = !selectedDepartment || 
            getDepartmentName(notice.department) === selectedDepartment;
          
          // Return true only if both conditions are met
          return categoryMatch && departmentMatch;
        });
      }
      
      setNotices(data);
      setNoticesNotFound(data.length === 0);
      
      // Update active filters
      const newFilters = [];
      if (selectedCategory) newFilters.push(selectedCategory);
      if (selectedDepartment) newFilters.push(selectedDepartment);
      if (searchTerm) newFilters.push(`Search: ${searchTerm}`);
      
      setActiveFilters(newFilters);
    } catch (error) {
      console.error('Error searching notices:', error);
      // Set empty notices on error
      setNotices([]);
      setNoticesNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    // Reset to empty strings (All Departments/Categories) instead of null
    setSelectedCategory('');
    setSelectedDepartment('');
    setSearchTerm('');
    setActiveFilters([]);
    fetchNotices();
  };
  
  // Remove individual filter
  const removeFilter = (filter) => {
    // Reset corresponding state based on filter
    if (filter === selectedCategory || filter === null) {
      setSelectedCategory('');
    } else if (filter === selectedDepartment || filter === null) {
      setSelectedDepartment('');
    } else if (filter.startsWith('Search:')) {
      setSearchTerm('');
    }
    
    // Remove from active filters
    const updatedFilters = activeFilters.filter(f => f !== filter);
    setActiveFilters(updatedFilters);
    
    // Trigger search only after state update
    handleSearch();
  };

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
        <h1 className="text-4xl font-bold text-primary-blue mb-4">Notices</h1>
        <p className="text-lg text-text-dark">All official announcements and circulars.</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            className="border border-gray-300 rounded-md px-4 py-2 w-full pl-10"
            placeholder="Search notices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
            aria-label="Search notices"
          />
          {searchTerm && (
            <button
              className="absolute right-10 top-2.5 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setSearchTerm('');
                fetchNotices();
              }}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
          <Search 
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer" 
            onClick={handleSearch}
          />
        </div>
        
        <select 
          className="border border-gray-300 rounded-md px-4 py-2"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">All Departments</option>
          {departmentdata.map((dept) => (
            <option key={dept.id} value={dept.department_name}>
              {dept.department_name}
            </option>
          ))}
        </select>
        
        <select 
          className="border border-gray-300 rounded-md px-4 py-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {typedata.map((type) => (
            <option key={type.id} value={type.notice_type}>
              {type.notice_type}
            </option>
          ))}
        </select>
        
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={handleSearch}
        >
          Apply Filter
        </button>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center flex-wrap">
            <span className="font-medium text-gray-800 mr-3">Active Filters:</span>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <span key={index} className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md text-sm">
                  {filter}
                  <button 
                    onClick={() => removeFilter(filter)} 
                    className="ml-2 text-blue-700 font-bold hover:bg-blue-200 rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </span>
              ))}
              <button 
                onClick={resetFilters}
                className="text-sm text-red-500 hover:text-red-700 ml-2 underline"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="py-10">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-center mt-4 text-gray-600">Loading notices...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && noticesNotFound && (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600">No notices found matching your criteria.</p>
          <button 
            onClick={resetFilters}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Clear filters and try again
          </button>
        </div>
      )}

      {/* Notice List */}
      {!loading && !noticesNotFound && (
        currentNotices.map((notice) => (
          <div key={notice.id} className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
            <div className="text-gray-600 text-sm mb-1">
              {notice.published_date} {notice.department && `| ${notice.department}`}
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
                {notice.download_file && (
                  <a 
                    href={notice.download_file}
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
  );
}
