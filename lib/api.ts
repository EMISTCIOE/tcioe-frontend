import { env } from "./env";

/**
 * API Configuration and base URL
 */
export const API_CONFIG = {
  BASE_URL: env.API_BASE_URL,
  TIMEOUT: env.API_TIMEOUT,
  DEBUG: env.API_DEBUG,
  ENDPOINTS: {
    NOTICES: "/api/v1/public/notice-mod/notices",
    NOTICE_CATEGORIES: "/api/v1/public/notice-mod/notices/categories",
    NOTICE_DEPARTMENTS: "/api/v1/public/notice-mod/notices/departments",
    NOTICE_DETAIL: (id: string) => `/api/v1/public/notice-mod/notices/${id}`,
    ACADEMIC_CALENDARS: "/api/v1/public/website-mod/academic-calendars",
    CAMPUS_DOWNLOADS: "/api/v1/public/website-mod/campus-downloads",
    CAMPUS_EVENTS: "/api/v1/public/website-mod/global-events",
    CAMPUS_INFO: "/api/v1/public/website-mod/campus-info",
    CAMPUS_KEY_OFFICIALS: "/api/v1/public/website-mod/campus-key-officials",
    CAMPUS_REPORTS: "/api/v1/public/website-mod/campus-reports",
  },
} as const;

/**
 * Base API client with error handling
 */
export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, String(value));
        }
      });
    }

    if (API_CONFIG.DEBUG) {
      console.log(`API Request: GET ${url.toString()}`);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        cache: "default",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (API_CONFIG.DEBUG) {
        console.log(`API Response: GET ${url.toString()}`, data);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`API Request timeout after ${API_CONFIG.TIMEOUT}ms`);
      }

      if (API_CONFIG.DEBUG) {
        console.error(`API Error: GET ${url.toString()}`, error);
      }

      throw error;
    }
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    if (API_CONFIG.DEBUG) {
      console.log(`API Request: PATCH ${this.baseURL}${endpoint}`, data);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();

      if (API_CONFIG.DEBUG) {
        console.log(
          `API Response: PATCH ${this.baseURL}${endpoint}`,
          responseData
        );
      }

      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`API Request timeout after ${API_CONFIG.TIMEOUT}ms`);
      }

      if (API_CONFIG.DEBUG) {
        console.error(`API Error: PATCH ${this.baseURL}${endpoint}`, error);
      }

      throw error;
    }
  }
}

export const apiClient = new ApiClient();
