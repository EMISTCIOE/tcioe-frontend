import { apiClient, API_CONFIG } from "@/lib/api";
import type { DownloadsResponse } from "@/types";

export interface DownloadsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Downloads API Service
 */
export class DownloadsService {
  /**
   * Get paginated list of campus downloads
   */
  static async getDownloads(
    params?: DownloadsQueryParams
  ): Promise<DownloadsResponse> {
    const queryParams: Record<string, any> = {};

    if (params?.page)
      queryParams.offset = (params.page - 1) * (params.limit || 10);
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.search) queryParams.search = params.search;

    return apiClient.get<DownloadsResponse>(
      API_CONFIG.ENDPOINTS.CAMPUS_DOWNLOADS,
      queryParams
    );
  }
}
