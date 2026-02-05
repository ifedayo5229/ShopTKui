export interface StoreRequestResponse {
    employeeLocationId: number;
    sourceStoreId: number;
    storeFunctionId: number;
    employeeFunctionId: number;
    requestDate: Date;
    lineManagerApprovalDate: Date;
    storeManagerApprovalDate: Date;
    itemId: number;
    quantity: number;
    isStoreRequest: boolean;
    id: number;
    isActive: boolean;
    createdDate: Date;
    isDeleted: boolean;
    employeeEmail:string;
    storeFunctionName: string;
    sourceStoreName:string;
    description:string;
    itemName:string;
    reference: string;
  }
  