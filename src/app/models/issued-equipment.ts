export interface IssuedEquipment {
  userId: string;
  employeeEmail: string;
  employeeLocationId: number;
  description: string;
  sourceStoreId: number;
  storeFunctionId: number;
  employeeFunctionId: number;
  requestDate: Date;
  storeManagerApprovalDate: Date;
  status: string;
  storeManagerComment: string;
  storeManagerEmail: string;
  storeManagerApprovalStatus: string;
  pendingWith: string;
  pendingWithDesignation: string;
  itemId: number;
  quantity: number;
  itemName: string;
  employeeLocationName: string;
  employeeFunctionName: string;
  sourceStoreName: string;
  storeFunctionName: string;
  issueDate: Date;
  reference: string;
  approvedQuantity: number;
  quantityBeforeRequest: number;
  rejectedBy: string;
  issueToEmail: string;
  issueToFunction: string;
  issueToName: string;
  equipmentAcknowledgedByEmployee: boolean;

  issueItems: IssueItemDto[];
}



export interface IssueItemDto{
    itemId: number;
    quantity: number;
}