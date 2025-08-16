"use client";

import { useEffect } from "react";
import { usePostHog } from "@/components/PostHogAnalytics";

interface DepartmentPageWrapperProps {
  children: React.ReactNode;
  departmentName: string;
  departmentType: string;
}

export function DepartmentPageWrapper({
  children,
  departmentName,
  departmentType,
}: DepartmentPageWrapperProps) {
  const { trackDepartmentView } = usePostHog();

  useEffect(() => {
    // Track department page view
    trackDepartmentView(departmentName, departmentType);
  }, [departmentName, departmentType, trackDepartmentView]);

  return <>{children}</>;
}
