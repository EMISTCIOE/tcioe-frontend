import { apiClient, API_CONFIG } from "@/lib/api";
import type { CampusReportsResponse } from "@/types";

export interface CampusReportsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  reportType?: "SELF_STUDY" | "ANNUAL" | "FINANCIAL" | "ACADEMIC" | "OTHER";
}

/**
 * Campus Reports API Service
 */
export class CampusReportsService {
  /**
   * Get paginated list of campus reports
   */
  static async getCampusReports(
    params?: CampusReportsQueryParams
  ): Promise<CampusReportsResponse> {
    const queryParams: Record<string, any> = {};

    if (params?.page)
      queryParams.offset = (params.page - 1) * (params.limit || 10);
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.search) queryParams.search = params.search;
    if (params?.reportType) queryParams.reportType = params.reportType;

    return apiClient.get<CampusReportsResponse>(
      API_CONFIG.ENDPOINTS.CAMPUS_REPORTS,
      queryParams
    );
  }
}
