
  export interface ItemRequestResponse {
    userId: string;
    employeeEmail: string;
    employeeLocationId: number;
    description: string;
    sourceStoreId: number;
    storeFunctionId: number;
    employeeFunctionId: number;
    requestDate: Date;
    status: string;
    linemanagerEmail: string;
    lineManagerName: string;
    lineManagerApprovalStatus: string;
    pendingWith: string;
    pendingWithDesignation: string;
    itemId: number;
    quantity: number;
    quantityBeforeRequest: number;
    approvedQuantity: number;
    itemName: string;
    employeeLocationName: string;
    employeeFunctionName: string;
    sourceStoreName: string;
    destinationStoreName: string;
    storeFunctionName: string;
    id: number;
    isActive: boolean;
    createdDate: Date;
    isDeleted: boolean;
    reference: string;
    rejectedBy: string;
    equipmentAcknowledgedByEmployee: boolean; 
  }