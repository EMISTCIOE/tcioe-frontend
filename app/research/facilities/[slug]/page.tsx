"use client";

import { useParams } from "next/navigation";
import { CampusDivisionDetailView } from "@/components/campus-division-detail";

export default function ResearchFacilityDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug as string;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <CampusDivisionDetailView slug={slug} kind="research-facilities" />
    </div>
  );
}
