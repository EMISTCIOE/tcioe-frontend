"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AnnouncementBarProps {
  announcements: string[];
}

export const AnnouncementBar = ({ announcements }: AnnouncementBarProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
      }, 5000); // Change announcement every 5 seconds
      return () => clearInterval(interval);
    }
  }, [announcements]);

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + announcements.length) % announcements.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
  };

  if (!announcements || announcements.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-center flex-1 relative h-5 overflow-hidden">
      {announcements.map((announcement, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out",
            index === currentIndex
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          )}
        >
          <Link
            href="/notices"
            className="hover:underline cursor-pointer text-center truncate px-4"
            title={announcement}
          >
            {announcement}
          </Link>
        </div>
      ))}
      {announcements.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Previous announcement"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Next announcement"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
      {announcements.length > 1 && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-1">
          {announcements.map((_, index) => (
            <span
              key={index}
              className={cn(
                "block h-1 w-1 rounded-full bg-white transition-all duration-300",
                index === currentIndex ? "w-3 bg-white/80" : "bg-white/40"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};
