import { apiClient, API_CONFIG } from "@/lib/api";
import type {
  NoticesResponse,
  NoticeCategoriesResponse,
  NoticeDepartmentsResponse,
  Notice,
} from "@/types";

export interface NoticesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  department?: string;
  is_featured?: boolean;
  is_approved_by_department?: boolean;
  is_approved_by_campus?: boolean;
  start_date?: string;
  end_date?: string;
  ordering?: string;
}

/**
 * Notices API Service
 */
export class NoticesService {
  /**
   * Get paginated list of notices
   */
  static async getNotices(
    params?: NoticesQueryParams
  ): Promise<NoticesResponse> {
    const queryParams: Record<string, any> = {};

    if (params?.page)
      queryParams.offset = (params.page - 1) * (params.limit || 10);
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.search) queryParams.search = params.search;
    if (params?.category) queryParams.category = params.category;
    if (params?.department) queryParams.department = params.department;
    if (params?.is_featured !== undefined)
      queryParams.is_featured = params.is_featured;
    if (params?.is_approved_by_department !== undefined) {
      queryParams.is_approved_by_department = params.is_approved_by_department;
    }
    if (params?.is_approved_by_campus !== undefined) {
      queryParams.is_approved_by_campus = params.is_approved_by_campus;
    }
    if (params?.start_date) queryParams.start_date = params.start_date;
    if (params?.end_date) queryParams.end_date = params.end_date;
    if (params?.ordering) queryParams.ordering = params.ordering;

    return apiClient.get<NoticesResponse>(
      API_CONFIG.ENDPOINTS.NOTICES,
      queryParams
    );
  }

  /**
   * Get single notice by UUID
   */
  static async getNoticeById(uuid: string): Promise<Notice> {
    return apiClient.get<Notice>(API_CONFIG.ENDPOINTS.NOTICE_DETAIL(uuid));
  }

  /**
   * Get single notice by slug or UUID
   * If the identifier looks like a UUID, use direct API call
   * If it's a slug, search for the notice and then get detailed data using UUID
   */
  static async getNoticeBySlugOrId(identifier: string): Promise<Notice> {
    // Check if identifier is a UUID (basic UUID format check)
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier
      );

    if (isUUID) {
      // It's a UUID, use direct endpoint
      return this.getNoticeById(identifier);
    } else {
      // It's a slug, first try to extract UUID from the slug
      const uuidMatch = identifier.match(
        /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
      );

      if (uuidMatch) {
        // Found UUID in slug, use it directly for detailed data
        const uuid = uuidMatch[1];
        return this.getNoticeById(uuid);
      } else {
        // No UUID found in slug, search for notices to find the matching slug
        const searchResponse = await this.getNotices({
          limit: 100, // Get more results to ensure we find the slug
        });

        // Find exact slug match
        const notice = searchResponse.results.find(
          (n) => n.slug === identifier
        );

        if (!notice) {
          throw new Error(`Notice with slug "${identifier}" not found`);
        }

        // Now use the notice's UUID to get detailed data
        return this.getNoticeById(notice.uuid);
      }
    }
  }

  /**
   * Get notice categories
   */
  static async getNoticeCategories(): Promise<NoticeCategoriesResponse> {
    return apiClient.get<NoticeCategoriesResponse>(
      API_CONFIG.ENDPOINTS.NOTICE_CATEGORIES
    );
  }

  /**
   * Get notice departments
   */
  static async getNoticeDepartments(): Promise<NoticeDepartmentsResponse> {
    return apiClient.get<NoticeDepartmentsResponse>(
      API_CONFIG.ENDPOINTS.NOTICE_DEPARTMENTS
    );
  }

  /**
   * Increment notice view count
   */
  static async incrementNoticeViews(uuid: string): Promise<any> {
    return apiClient.patch(`${API_CONFIG.ENDPOINTS.NOTICES}/${uuid}/view`);
  }

  /**
   * Increment notice share count
   */
  static async incrementNoticeShares(uuid: string): Promise<any> {
    return apiClient.patch(`${API_CONFIG.ENDPOINTS.NOTICES}/${uuid}/share`);
  }
}
