import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { Calendar } from 'lucide-react';

// Define interface for Notice data structure
interface Notice {
  id: number;
  title: string;
  published_date: string;
  notice_category?: {
    notice_type: string;
  };
}

// Define component props interface
interface LatestNoticesProps {
  activeId?: number;
  limit?: number;
}

// Helper function to get the complete classes for a category badge
const getCategoryClasses = (category: string): string => {
  const baseClasses = "text-xs px-2 py-1 rounded";
  
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

const LatestNotices: React.FC<LatestNoticesProps> = ({ activeId, limit = 5 }) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch('https://notices.tcioe.edu.np/api/notice/notices/', {
          cache: 'no-store',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch notices: ${response.status}`);
        }
        
        const data = await response.json();
        // Limit the number of notices
        setNotices(data.slice(0, limit));
      } catch (error) {
        console.error('Error fetching notices:', error);
        setNotices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [limit]);
  
  return (
    <aside className="w-full md:w-[350px]">
      <div className="border-l-4 border-orange-500 pl-3 mb-4">
        <h3 className="text-2xl font-bold text-gray-800">Latest Notices</h3>
      </div>

      <div className="max-h-[600px] overflow-y-auto pr-2">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : notices.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No notices available</p>
        ) : (
          <ul className="space-y-5">
            {notices.map((notice) => (
              <li key={notice.id} className="flex flex-col border-b pb-2">
                <div className="flex justify-between items-center mb-1">
                  {notice.notice_category && (
                    <span className={getCategoryClasses(notice.notice_category.notice_type)}>
                      {notice.notice_category.notice_type}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={12} />
                    {notice.published_date ? new Date(notice.published_date).toLocaleDateString('en-US', {
                      timeZone: 'Asia/Kathmandu' // Nepal's timezone
                    }) : ''}
                  </span>
                </div>
                <Link 
                  href={`/notices/${notice.id}`} 
                  className={`font-medium ${notice.id === activeId ? "text-orange-600" : "text-gray-700"} hover:underline`}
                >
                  {notice.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default LatestNotices;
