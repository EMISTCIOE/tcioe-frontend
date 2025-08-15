"use client";

import { useEffect } from "react";

interface StructuredDataProps {
  data: object | object[];
}

export function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(Array.isArray(data) ? data : [data]);

    // Remove existing structured data script if any
    const existingScript = document.querySelector(
      'script[type="application/ld+json"][data-structured-data]'
    );
    if (existingScript) {
      existingScript.remove();
    }

    script.setAttribute("data-structured-data", "true");
    document.head.appendChild(script);

    return () => {
      const currentScript = document.querySelector(
        'script[type="application/ld+json"][data-structured-data]'
      );
      if (currentScript) {
        currentScript.remove();
      }
    };
  }, [data]);

  return null;
}

// Hook for adding structured data
export function useStructuredData(data: object | object[]) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(Array.isArray(data) ? data : [data]);
    script.setAttribute("data-structured-data-hook", "true");
    document.head.appendChild(script);

    return () => {
      const currentScript = document.querySelector(
        'script[type="application/ld+json"][data-structured-data-hook]'
      );
      if (currentScript) {
        currentScript.remove();
      }
    };
  }, [data]);
}
