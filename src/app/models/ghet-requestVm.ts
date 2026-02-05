export interface GhetItemRequest {
  userId: string;
  employeeEmail: string;
  employeeLocationId: number;
  description: string;
  sourceStoreId: number;
  storeFunctionId: number;
  employeeFunctionId: number;
  justification: string;
  ghet: string;
  hodToApprove: string;
  requestItems: RequestItem[];
}

export interface RequestItem {
  itemId: number;
  quantity: number;
}