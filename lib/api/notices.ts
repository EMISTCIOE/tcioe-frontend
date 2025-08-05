import { apiClient, API_CONFIG } from '@/lib/api';
import type { 
  NoticesResponse, 
  NoticeCategoriesResponse, 
  NoticeDepartmentsResponse, 
  Notice 
} from '@/types';

export interface NoticesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  department?: string;
  is_featured?: boolean;
  ordering?: string;
}

/**
 * Notices API Service
 */
export class NoticesService {
  /**
   * Get paginated list of notices
   */
  static async getNotices(params?: NoticesQueryParams): Promise<NoticesResponse> {
    const queryParams: Record<string, any> = {};
    
    if (params?.page) queryParams.offset = (params.page - 1) * (params.limit || 10);
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.search) queryParams.search = params.search;
    if (params?.category) queryParams.category = params.category;
    if (params?.department) queryParams.department = params.department;
    if (params?.is_featured !== undefined) queryParams.is_featured = params.is_featured;
    if (params?.ordering) queryParams.ordering = params.ordering;

    return apiClient.get<NoticesResponse>(API_CONFIG.ENDPOINTS.NOTICES, queryParams);
  }

  /**
   * Get single notice by UUID
   */
  static async getNoticeById(uuid: string): Promise<Notice> {
    return apiClient.get<Notice>(API_CONFIG.ENDPOINTS.NOTICE_DETAIL(uuid));
  }

  /**
   * Get notice categories
   */
  static async getNoticeCategories(): Promise<NoticeCategoriesResponse> {
    return apiClient.get<NoticeCategoriesResponse>(API_CONFIG.ENDPOINTS.NOTICE_CATEGORIES);
  }

  /**
   * Get notice departments
   */
  static async getNoticeDepartments(): Promise<NoticeDepartmentsResponse> {
    return apiClient.get<NoticeDepartmentsResponse>(API_CONFIG.ENDPOINTS.NOTICE_DEPARTMENTS);
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
