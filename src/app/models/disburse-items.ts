export interface Item {
    itemId: number;
    quantity: number;
  }

export interface DisburseItems{
    userId: string;
    employeeEmail: string;
    employeeLocationId: number;
    description: string;
    destinationStoreId: number;
    sourceStoreId: number;
    storeFunctionId: number;
    employeeFunctionId: number;
    disburseItems: Item[];
}