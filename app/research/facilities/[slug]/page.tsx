"use client";

import { useParams } from "next/navigation";
import { ResearchFacilityDetailView } from "@/components/research-facility-detail";

export default function ResearchFacilityDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug as string;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <ResearchFacilityDetailView slug={slug} />
    </div>
  );
}
