/**
 * Department code utilities
 * Uses shortName from backend API (e.g., DOECE, DOAS) for routing
 * This allows URLs like /departments/doece instead of /departments/department-of-electronics-computer-engineering
 */

/**
 * Normalize department shortName for use in URLs
 * Converts "DOECE" -> "doece", "DoAS" -> "doas"
 */
export function normalizeCode(shortName: string | undefined): string {
  if (!shortName) return "";
  return shortName.toLowerCase().trim();
}

/**
 * Build external department URL using the shortName
 * Format: https://{shortName}.tcioe.edu.np/{path}
 */
export function getDepartmentUrl(shortName: string, path: string = ""): string {
  const code = normalizeCode(shortName);
  if (!code) return "#";

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `https://${code}.tcioe.edu.np${cleanPath}`;
}
