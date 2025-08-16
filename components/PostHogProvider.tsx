"use client";

import { Suspense } from "react";
import { PostHogAnalytics } from "./PostHogAnalytics";

function PostHogFallback() {
  return null;
}

export function PostHogProvider() {
  return (
    <Suspense fallback={<PostHogFallback />}>
      <PostHogAnalytics />
    </Suspense>
  );
}
