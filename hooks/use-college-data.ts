"use client";

import { useState, useEffect } from "react";
import type { College, NewsItem, Department, Event, Notice } from "@/types";
import { mockCollegeData } from "@/data/mock-data";
import { useAnnouncements } from "./use-announcements";

export const useCollegeData = () => {
  const [data, setData] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dynamic announcements from latest notices
  const { announcements: noticeAnnouncements, loading: announcementsLoading } =
    useAnnouncements(6);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Use mock data but replace announcements with dynamic ones
        const collegeData = { ...mockCollegeData };

        // Convert notices to announcement strings (titles only)
        if (noticeAnnouncements && noticeAnnouncements.length > 0) {
          collegeData.announcements = noticeAnnouncements.map(
            (notice) => notice.title
          );
        }

        setData(collegeData);
      } catch (err) {
        setError("Failed to fetch college data");
      } finally {
        setLoading(false);
      }
    };

    // Wait for announcements to load before setting data
    if (!announcementsLoading) {
      fetchData();
    }
  }, [noticeAnnouncements, announcementsLoading]);

  return { data, loading: loading || announcementsLoading, error };
};

export const useNews = () => {
  const { data, loading, error } = useCollegeData();
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    if (data) {
      setNews(data.news);
    }
  }, [data]);

  return { news, loading, error };
};

export const useDepartments = () => {
  const { data, loading, error } = useCollegeData();
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    if (data) {
      setDepartments(data.departments);
    }
  }, [data]);

  return { departments, loading, error };
};

export const useEvents = () => {
  const { data, loading, error } = useCollegeData();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (data) {
      setEvents(data.events);
    }
  }, [data]);

  return { events, loading, error };
};

export const useNotices = () => {
  const { data, loading, error } = useCollegeData();
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    if (data) {
      setNotices(data.notices);
    }
  }, [data]);

  return { notices, loading, error };
};
