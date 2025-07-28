import React from 'react';
import Link from 'next/link';
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const NoticesSidebar = ({ 
  displayNotices, 
  activeId, 
  showViewMoreButton,
  showAllNotices,
  checkButton,
  loadAllNotices,
  hidePartialNotices,
  scrollableRef,
  getCategoryClasses
}) => {
  return (
    <aside className="w-full md:w-[350px]">
      <div className="border-l-4 border-orange-500 pl-3 mb-4">
        <h3 className="text-2xl font-bold text-gray-800">Latest Notices</h3>
      </div>

      <div className="max-h-[600px] overflow-y-auto pr-2" ref={scrollableRef}>
        <ul className="space-y-5">
          {displayNotices.map((latestNotice) => (
            <li key={latestNotice.id} className="flex flex-col border-b pb-2">
              <div className="flex justify-between items-center mb-1">
                {latestNotice.notice_category && (
                  <span className={getCategoryClasses(latestNotice.notice_category.notice_type)}>
                    {latestNotice.notice_category.notice_type}
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  {latestNotice.published_date 
                    ? new Date(latestNotice.published_date).toLocaleDateString()
                    : ''}
                </span>
              </div>
              <Link 
                href={`/notices/${latestNotice.id}`} 
                className={`font-medium ${latestNotice.id === activeId ? "text-orange-600" : "text-gray-700"} hover:underline`}
              >
                {latestNotice.title}
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="mt-4 flex justify-end">
          {showViewMoreButton && !showAllNotices && (
            <Link
              href="/notices"
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors"
            >
              View More <FaArrowDown />
            </Link>
          )}
          
          {checkButton && (
            <button
              onClick={hidePartialNotices}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
            >
              Back to Top <FaArrowUp />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default NoticesSidebar;
