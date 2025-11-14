"use client";

import Link from "next/link";
import { X } from "lucide-react";

import type { Notice } from "@/types";

interface FeaturedNoticePopupProps {
  notice: Notice;
  open: boolean;
  onClose: () => void;
}

export function FeaturedNoticePopup({ notice, open, onClose }: FeaturedNoticePopupProps) {
  if (!open) return null;

  const primaryMedia = notice.medias?.[0];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4">
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-4 -top-4 rounded-full bg-white/80 p-1.5 text-gray-700 shadow transition hover:bg-white"
          aria-label="Close featured notice"
        >
          <X className="h-5 w-5" />
        </button>

        <Link
          href={`/notices/${notice.slug}`}
          className="block overflow-hidden rounded-2xl"
        >
          {notice.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={notice.thumbnail}
              alt={notice.title}
              className="max-h-[80vh] max-w-[90vw] rounded-2xl border border-white/10 object-contain"
            />
          ) : primaryMedia ? (
            <iframe
              src={primaryMedia.file}
              className="h-[70vh] w-[90vw] rounded-2xl border border-white/20 bg-white"
              title={primaryMedia.caption || notice.title}
            />
          ) : (
            <div className="flex h-[50vh] items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100">
              <span className="text-lg font-semibold text-blue-600">
                Featured Notice
              </span>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
}
