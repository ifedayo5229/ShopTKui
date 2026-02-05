export interface Item {
    itemId: number;
    quantity: number;
  }

export interface DirectIssue{
    userId: string;
    employeeEmail: string;
    employeeLocationId: number;
    description: string;
    sourceStoreId: number;
    storeFunctionId: number;
    employeeFunctionId: number;
    issueItems: Item[];
}