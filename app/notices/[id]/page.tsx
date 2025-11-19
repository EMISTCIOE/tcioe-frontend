"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Calendar,
  ExternalLink,
  FileText,
  Download,
  Share2,
} from "lucide-react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import NoticesSidebar from "@/components/NoticesSidebar";
import { useNotice, useNotices } from "@/hooks/use-notices";
import { getCategoryColor, formatNoticeDate } from "@/lib/notices-utils";
import type { Notice } from "@/types";
import { API_CONFIG } from "@/lib/api";

// Helper function to get the complete classes for a category badge
const getCategoryClasses = (category: string) => {
  const baseClasses = "text-sm px-2 py-1 rounded";

  switch (category) {
    case "Exam":
      return twMerge(baseClasses, "bg-green-100 text-green-800");
    case "Administration":
      return twMerge(baseClasses, "bg-red-100 text-red-800");
    case "Scholarship":
      return twMerge(baseClasses, "bg-purple-100 text-purple-800");
    case "Event":
      return twMerge(baseClasses, "bg-teal-100 text-teal-800");
    case "Admission":
      return twMerge(baseClasses, "bg-blue-100 text-blue-800");
    case "Department":
      return twMerge(baseClasses, "bg-cyan-100 text-cyan-800");
    case "General":
      return twMerge(baseClasses, "bg-gray-100 text-gray-800");
    default:
      return twMerge(baseClasses, "bg-gray-100 text-gray-800");
  }
};

// In Next.js App Router, page components receive params directly as a prop
interface PageParams {
  params: Promise<{ id: string }>;
}

// Inner component that receives resolved params
function NoticeDetailContent({
  noticeIdentifier,
}: {
  noticeIdentifier: string;
}) {
  // Use the new hooks for API calls
  const { notice, loading, error } = useNotice(noticeIdentifier);
  const { notices: latestNotices, loading: latestLoading } = useNotices({
    limit: 10,
    ordering: "-published_at",
  });

  const [showAllNotices, setShowAllNotices] = useState<boolean>(false);
  const [allNotices, setAllNotices] = useState<Notice[]>([]);
  const [showViewMoreButton, setShowViewMoreButton] = useState<boolean>(true);
  const [checkButton, setCheckButton] = useState<boolean>(false);
  const [shareText, setShareText] = useState("Share");
  const scrollableRef = useRef<HTMLDivElement>(null);
  // PDF viewer state
  const pdfIframeRef = useRef<HTMLIFrameElement | null>(null);
  const [pdfTotalPages, setPdfTotalPages] = useState<number | null>(null);
  const [pdfCurrentPage, setPdfCurrentPage] = useState<number>(1);
  const [pdfZoom, setPdfZoom] = useState<number>(100);
  const [autoFitZoom, setAutoFitZoom] = useState<boolean>(true);

  // Load all notices at component level (hooks must be called at top level)
  const {
    notices: allNoticesFromAPI,
    loading: loadingAllNotices,
    error: errorAllNotices,
  } = useNotices({
    limit: 100,
    ordering: "-published_at",
  });

  const downloadableMedia = notice?.medias?.find(
    (media) =>
      media.mediaType === "DOCUMENT" || media.file.toLowerCase().includes(".pdf")
  );

  const handleZoomOut = () => {
    setAutoFitZoom(false);
    setPdfZoom((z) => Math.max(50, z - 10));
  };

  const handleZoomIn = () => {
    setAutoFitZoom(false);
    setPdfZoom((z) => Math.min(400, z + 10));
  };

  // Load PDF metadata (page count) using pdf.js from CDN when we have a PDF
  useEffect(() => {
    let mounted = true;
    const loadPdfMeta = async () => {
      if (!downloadableMedia) return;
      const isPdf =
        downloadableMedia.file.toLowerCase().endsWith(".pdf") ||
        downloadableMedia.mediaType === "DOCUMENT";
      if (!isPdf) return;

      try {
        // Load pdf.js from CDN if not already present
        if (!(window as any).pdfjsLib) {
          await new Promise<void>((resolve, reject) => {
            const s = document.createElement("script");
            s.src =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.min.js";
            s.async = true;
            s.onload = () => resolve();
            s.onerror = () => reject(new Error("Failed to load pdfjs"));
            document.head.appendChild(s);
          });
        }

        const pdfjsLib = (window as any).pdfjsLib;
        if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
          pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js";
        }

        const resp = await fetch(downloadableMedia.file);
        const arrayBuffer = await resp.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        if (!mounted) return;
        setPdfTotalPages(pdf.numPages || null);
        setPdfCurrentPage(1);
        setPdfZoom(100);
        setAutoFitZoom(true);
      } catch (err) {
        // If metadata can't be loaded, leave pages unknown
        setPdfTotalPages(null);
        setPdfCurrentPage(1);
        console.warn("Could not load PDF metadata:", err);
      }
    };

    loadPdfMeta();
    return () => {
      mounted = false;
    };
  }, [downloadableMedia]);

  // Update iframe src whenever page/zoom/media changes
  useEffect(() => {
    if (!downloadableMedia) return;
    const base = downloadableMedia.file;
    const page = pdfCurrentPage || 1;
    const zoomParam = autoFitZoom ? "page-width" : `${pdfZoom}%`;
    const src = `${base}#toolbar=0&navpanes=0&scrollbar=0&page=${page}&zoom=${encodeURIComponent(
      zoomParam
    )}`;
    if (pdfIframeRef.current) {
      // set src directly to navigate
      pdfIframeRef.current.src = src;
    }
  }, [downloadableMedia, pdfCurrentPage, pdfZoom, autoFitZoom]);

  // Function to show all notices (just updates state now)
  const loadAllNotices = () => {
    setAllNotices(allNoticesFromAPI || []);
    setShowAllNotices(true);
    setShowViewMoreButton(false);
    setCheckButton(true);
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
    : (latestNotices || []).slice(0, 10);

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

  // Notice not found or error
  if (error || !notice) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-orange-500 inline-block pb-1">
            Notice Not Found
          </h1>
          <p className="mt-6">
            The notice you are looking for could not be found. Please check the
            URL or go back to the
            <Link
              href="/notices"
              className="text-blue-600 hover:underline ml-1"
            >
              notices page
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  // Format published date for API response
  const formattedDate = notice?.publishedAt
    ? formatNoticeDate(notice.publishedAt)
    : null;

  // Parse the active ID for highlighting in the sidebar
  const activeId = notice.uuid;
  const mediaLabel =
    downloadableMedia &&
    downloadableMedia.caption &&
    downloadableMedia.caption.trim().length > 0
      ? downloadableMedia.caption
      : notice.title;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const pdfViewerZoomParam = autoFitZoom ? "page-width" : `${pdfZoom}%`;

  const handleShare = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setShareText("Copied!");
    } catch (error) {
      setShareText("Failed");
    } finally {
      setTimeout(() => setShareText("Share"), 1600);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Title heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 border-b-4 border-orange-500 inline-block pb-1 mb-6">
          Notices and Announcements
        </h1>

        <div className="flex flex-col gap-6 mt-6 md:flex-row md:items-start md:gap-10">
          {/* Main Notice Detail Section */}
          <div className="flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-blue-900 leading-snug">
                  {notice.title}
                </h2>
                {notice.category?.name && (
                  <span
                    className={`inline-flex items-center mt-1 text-xs font-semibold uppercase px-3 py-1 rounded-full ${getCategoryColor(
                      notice.category.name
                    )}`}
                  >
                    {notice.category.name}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500 flex flex-wrap gap-3">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Published on {formattedDate}
                </span>
                <span>{notice.department?.name ?? "College Wide"}</span>
              </div>
            </div>

            {/* Notice Description */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <div
                className="text-gray-800 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: notice.description }}
              />
            </div>

            {/* Enhanced Media Viewer with Super Cool UI */}
            {downloadableMedia && (
              <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                {/* Media Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-white">
                  <div className="flex items-center justify-between">
                    {/* Left: simple reader controls: page input and zoom */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-white/20 px-2 py-1 rounded-md text-sm text-white">
                        <label className="mr-2">Page</label>
                        <input
                          type="number"
                          min={1}
                          max={pdfTotalPages ?? 9999}
                          value={pdfCurrentPage}
                          onChange={(e) => {
                            let v = Number(e.target.value || 1);
                            if (pdfTotalPages)
                              v = Math.min(Math.max(1, v), pdfTotalPages);
                            setPdfCurrentPage(v);
                          }}
                          className="w-14 text-black px-1 rounded"
                        />
                        <span className="mx-2">of</span>
                        <span className="font-semibold">
                          {pdfTotalPages ?? "—"}
                        </span>
                      </div>

                      <div className="inline-flex items-center bg-white/10 rounded-md overflow-hidden text-sm">
                        <button
                          onClick={handleZoomOut}
                          className="px-2 py-1 text-white"
                          aria-label="Zoom out"
                        >
                          -
                        </button>
                        <div className="px-3 py-1 text-white">
                          {autoFitZoom ? "Auto" : `${pdfZoom}%`}
                        </div>
                        <button
                          onClick={handleZoomIn}
                          className="px-2 py-1 text-white"
                          aria-label="Zoom in"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Right: download and info */}
                    <div className="flex items-center gap-2">
                      <a
                        href={downloadableMedia.file}
                        download
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md transition-colors flex items-center gap-1 text-sm"
                        title="Download"
                      >
                        <Download className="h-3 w-3" />
                      </a>
                      <button
                        onClick={() => {
                          const el = document.getElementById("media-info");
                          if (el) el.classList.toggle("hidden");
                        }}
                        className="bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-md transition-colors"
                        title="Info"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-3a1 1 0 100-2 1 1 0 000 2zm1 9V9a1 1 0 10-2 0v7a1 1 0 002 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Media Viewer Container */}
                <div className="relative bg-gray-50 overflow-x-hidden">
                  {/* Loading overlay */}
                  <div
                    className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10"
                    id="media-loading"
                  >
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading media...</p>
                    </div>
                  </div>

                  {/* Check if it's an image or PDF */}
                  {downloadableMedia.file.toLowerCase().includes(".pdf") ||
                  downloadableMedia.mediaType === "DOCUMENT" ? (
                    /* PDF Iframe */
                    <iframe
                      ref={pdfIframeRef}
                      src={`${downloadableMedia.file}#toolbar=0&navpanes=0&scrollbar=0&page=${pdfCurrentPage}&zoom=${encodeURIComponent(
                        pdfViewerZoomParam
                      )}`}
                      className="w-full max-w-full h-[800px] border-0"
                      title={`Document for ${notice.title}`}
                      onLoad={() => {
                        const loadingElement =
                          document.getElementById("media-loading");
                        if (loadingElement) {
                          loadingElement.style.display = "none";
                        }
                      }}
                      allowFullScreen
                    />
                  ) : downloadableMedia.mediaType === "IMAGE" ? (
                    /* Enhanced Image Viewer */
                    <div className="relative">
                      <img
                        src={downloadableMedia.file}
                        alt={downloadableMedia.caption || notice.title}
                        className="w-full h-auto max-h-[800px] object-contain bg-white"
                        onLoad={() => {
                          const loadingElement =
                            document.getElementById("media-loading");
                          if (loadingElement) {
                            loadingElement.style.display = "none";
                          }
                        }}
                      />
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={() => {
                            const img = document.querySelector("img");
                            if (img) {
                              if (img.requestFullscreen) {
                                img.requestFullscreen();
                              }
                            }
                          }}
                          className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
                          title="View Fullscreen"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Other media types */
                    <div className="p-8 text-center">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        This file type cannot be previewed directly.
                      </p>
                      <a
                        href={downloadableMedia.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        Download File
                      </a>
                    </div>
                  )}
                </div>

                {/* Media Footer */}
                <div
                  id="media-info"
                  className="bg-gray-50 p-4 border-t border-gray-200"
                >
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>
                      {downloadableMedia.mediaType === "IMAGE"
                        ? "Image"
                        : "Document"}
                      : {mediaLabel}
                    </span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleShare()}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        title="Copy link to clipboard"
                      >
                        <Share2 className="h-4 w-4" />
                        {shareText}
                      </button>
                      <span className="text-gray-400">|</span>
                      <span>Published: {formattedDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Media */}
            {notice.medias && notice.medias.length > 1 && (
              <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Additional Media</h3>
                <div className="overflow-x-auto md:overflow-visible -mx-3 px-3 pb-2">
                  <div className="flex gap-4 snap-x snap-mandatory scroll-smooth md:grid md:grid-cols-2 md:snap-none">
                    {notice.medias
                      .filter((media) => media.uuid !== downloadableMedia?.uuid)
                      .map((media) => (
                        <div
                          key={media.uuid}
                          className="border rounded-lg p-4 flex-shrink-0 min-w-full snap-start md:min-w-0"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {/* Icon placeholder */}
                            <span className="text-sm">📄</span>
                            <span className="font-medium">{media.caption}</span>
                          </div>
                          <a
                            href={media.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                          >
                            View {media.mediaType.toLowerCase()}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Section with Latest Notices - TODO: Update NoticesSidebar to work with new API */}
          <div className="w-full md:w-80 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Latest Notices</h3>
            <div className="space-y-3">
              {(latestNotices || []).slice(0, 5).map((latestNotice) => (
                <Link
                  key={latestNotice.uuid}
                  href={`/notices/${latestNotice.slug}`}
                  className={`block p-3 rounded-lg border transition-colors ${
                    latestNotice.uuid === notice.uuid
                      ? "bg-blue-50 border-blue-200"
                      : "hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <h4 className="font-medium text-sm line-clamp-2 mb-1">
                    {latestNotice.title}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {formatNoticeDate(latestNotice.publishedAt)}
                  </p>
                  {latestNotice.category && (
                    <span
                      className={`inline-block mt-1 text-xs px-2 py-1 rounded ${getCategoryColor(
                        latestNotice.category.name
                      )}`}
                    >
                      {latestNotice.category.name}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {!latestLoading && latestNotices && latestNotices.length > 5 && (
              <div className="mt-4 pt-4 border-t">
                <Link
                  href="/notices"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All Notices →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper component that unwraps params
export default function NoticeDetail({ params }: PageParams) {
  // Unwrap params Promise using React.use()
  const resolvedParams = React.use(params);
  const noticeIdentifier = resolvedParams.id;

  return <NoticeDetailContent noticeIdentifier={noticeIdentifier} />;
}
