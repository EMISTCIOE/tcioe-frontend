"use client";

import { useParams } from "next/navigation";
import { DepartmentDynamic } from "@/components/DepartmentDynamic";

export default function DepartmentDynamicPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug as string;
  return <DepartmentDynamic slug={slug} />;
}
