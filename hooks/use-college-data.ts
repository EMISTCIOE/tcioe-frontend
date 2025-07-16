"use client"

import { useState, useEffect } from "react"
import type { College, NewsItem, Department, Event, Notice } from "@/types"
import { mockCollegeData } from "@/data/mock-data"

export const useCollegeData = () => {
  const [data, setData] = useState<College | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))
        setData(mockCollegeData)
      } catch (err) {
        setError("Failed to fetch college data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export const useNews = () => {
  const { data, loading, error } = useCollegeData()
  const [news, setNews] = useState<NewsItem[]>([])

  useEffect(() => {
    if (data) {
      setNews(data.news)
    }
  }, [data])

  return { news, loading, error }
}

export const useDepartments = () => {
  const { data, loading, error } = useCollegeData()
  const [departments, setDepartments] = useState<Department[]>([])

  useEffect(() => {
    if (data) {
      setDepartments(data.departments)
    }
  }, [data])

  return { departments, loading, error }
}

export const useEvents = () => {
  const { data, loading, error } = useCollegeData()
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    if (data) {
      setEvents(data.events)
    }
  }, [data])

  return { events, loading, error }
}

export const useNotices = () => {
  const { data, loading, error } = useCollegeData()
  const [notices, setNotices] = useState<Notice[]>([])

  useEffect(() => {
    if (data) {
      setNotices(data.notices)
    }
  }, [data])

  return { notices, loading, error }
}
