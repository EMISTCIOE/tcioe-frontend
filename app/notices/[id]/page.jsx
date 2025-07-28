'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Calendar, ExternalLink } from 'lucide-react';
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { twMerge } from 'tailwind-merge';
import NoticesSidebar from '@/components/NoticesSidebar';

// Helper function to get the complete classes for a category badge
const getCategoryClasses = (category) => {
  const baseClasses = "text-sm px-2 py-1 rounded";
  
  switch(category) {
    case 'Exam':
      return twMerge(baseClasses, "bg-green-100 text-green-800");
    case 'Administration':
      return twMerge(baseClasses, "bg-red-100 text-red-800");
    case 'Scholarship':
      return twMerge(baseClasses, "bg-purple-100 text-purple-800");
    case 'Event':
      return twMerge(baseClasses, "bg-teal-100 text-teal-800");
    case 'Admission':
      return twMerge(baseClasses, "bg-blue-100 text-blue-800");
    case 'Department':
      return twMerge(baseClasses, "bg-cyan-100 text-cyan-800");
    case 'General':
      return twMerge(baseClasses, "bg-gray-100 text-gray-800");
    default:
      return twMerge(baseClasses, "bg-gray-100 text-gray-800");
  }
};

// In Next.js App Router, page components receive params directly as a prop
export default function NoticeDetail({ params }) {
  // Access the ID directly from params
  const noticeId = params.id;
  
  const [file, setFile] = useState("");
  const [notice, setNotice] = useState(null);
  const [latestNotices, setLatestNotices] = useState([]);
  const [showAllNotices, setShowAllNotices] = useState(false);
  const [allNotices, setAllNotices] = useState([]);
  const [showViewMoreButton, setShowViewMoreButton] = useState(true);
  const [checkButton, setCheckButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollableRef = useRef(null);
  
  // Function to load all notices
  const loadAllNotices = async () => {
    try {
      const query = await fetch("https://notices.tcioe.edu.np/api/notice/notices");
      const response = await query.json();
      setAllNotices(response);
      setShowAllNotices(true);
      setShowViewMoreButton(false);
      setCheckButton(true);
    } catch (error) {
      console.error("Error loading all notices:", error);
      // Show error state
      setAllNotices([]);
      setShowAllNotices(true);
      setShowViewMoreButton(false);
      setCheckButton(true);
    }
  };

  // Function to scroll back to top
  const hidePartialNotices = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    if (scrollableRef.current) {
      scrollableRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    
    setShowAllNotices(false);
    setShowViewMoreButton(true);
    setCheckButton(false);
  };

  // Determine which notices to display
  const displayNotices = showAllNotices
    ? allNotices
    : latestNotices.slice(0, 10);
  
  useEffect(() => {
    const getData = async () => {
      try {
        // API call to fetch notice details
        const query = await fetch(
          `https://notices.tcioe.edu.np/api/notice/notices/${noticeId}`
        );
        const response = await query.json();
        
        if (response) {
          const file_ = response.download_file?.split("/")[5];
          setNotice(response);
          if (file_) {
            setFile(decodeURI(file_));
          }
        }
      } catch (error) {
        console.error("Error fetching notice:", error);
        setNotice(null);
      } finally {
        setLoading(false);
      }
    };

    const getLatestNotices = async () => {
      try {
        // API call to fetch latest notices
        const latestNoticesQuery = await fetch(
          "https://notices.tcioe.edu.np/api/notice/notices"
        );
        const latestNoticesResponse = await latestNoticesQuery.json();

        if (latestNoticesResponse && latestNoticesResponse.length > 0) {
          setLatestNotices(latestNoticesResponse);
        }
      } catch (error) {
        console.error("Error fetching latest notices:", error);
        setLatestNotices([]);
      }
    };

    getData();
    getLatestNotices();
  }, [noticeId]);
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }
  
  // Notice not found
  if (!notice) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-orange-500 inline-block pb-1">
            Notice Not Found
          </h1>
          <p className="mt-6">
            The notice you are looking for could not be found. Please check the URL or go back to the 
            <Link href="/notices" className="text-blue-600 hover:underline ml-1">
              notices page
            </Link>.
          </p>
        </div>
      </div>
    );
  }
  
  // Format published date for API response
  const formattedDate = notice?.published_date 
    ? new Date(notice.published_date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;
  
  // Parse the active ID for highlighting in the sidebar
  const activeId = parseInt(noticeId, 10);
  
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
        
        {/* Main Notice Detail Section */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-orange-500 inline-block pb-1 mb-6">
            Notices and Announcements
          </h1>

          <div>
            <h2 className="text-2xl font-semibold text-blue-900 flex items-start justify-between flex-wrap">
              <span className="mr-2">{notice.title}</span>
              {(notice.notice_category?.notice_type) && (
                <span className={getCategoryClasses(notice.notice_category.notice_type)}>
                  {notice.notice_category.notice_type}
                </span>
              )}
            </h2>
            <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
              <Calendar className="inline h-4 w-4" />
              {formattedDate}
              {notice.department?.department_name && ` | ${notice.department.department_name}`}
            </p>
          </div>

          {/* Notice Description */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-gray-800">{notice.description}</p>
          </div>

          {/* PDF Viewer */}
          <div className="mt-6 rounded overflow-hidden border border-gray-300">
            <div className="bg-gray-100 p-3 border-b">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Attached Document</span>
                {file && (
                  <a 
                    href={`https://notices.tcioe.edu.np/media/files/${file}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    <span>Open in New Tab</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
            <div className="w-full h-[600px] md:h-[700px] bg-gray-50">
              {file && (
                <iframe
                  src={`https://notices.tcioe.edu.np/media/files/${file}`}
                  className="w-full h-full border-0"
                  title={`PDF for ${notice.title}`}
                />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Section with Latest Notices */}
        <NoticesSidebar 
          displayNotices={displayNotices}
          activeId={activeId}
          showViewMoreButton={showViewMoreButton}
          showAllNotices={showAllNotices}
          checkButton={checkButton}
          loadAllNotices={loadAllNotices}
          hidePartialNotices={hidePartialNotices}
          scrollableRef={scrollableRef}
          getCategoryClasses={getCategoryClasses}
        />
      </div>
    </div>
  );
}
