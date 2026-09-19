export interface ApiResponse<T> {
  success: boolean;
  requestSuccessful?: boolean;
  message: string;
  data?: T;
  responseData?: T;
  responseCode?: string;
  errors?: string[];
}

/** Check if an API response indicates success (supports both response formats) */
export function isApiSuccess<T>(response: ApiResponse<T>): boolean {
  return response.success === true ||
         response.requestSuccessful === true ||
         response.responseCode === '00';
}

/** Extract data from API response (supports both response formats) */
export function getApiData<T>(response: ApiResponse<T>): T | undefined {
  return response.data ?? response.responseData;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface DateRangeRequest {
  startDate: Date;
  endDate: Date;
  shopId?: number;
}
