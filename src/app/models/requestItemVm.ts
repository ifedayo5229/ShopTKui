export interface Item {
    itemId: number;
    quantity: number;
  }

export interface RequestItems{
    userId: string;
    employeeEmail: string;
    employeeLocationId: number;
    description: string;
    sourceStoreId: number;
    storeFunctionId: number;
    employeeFunctionId: number;
    requestItems: Item[];
}