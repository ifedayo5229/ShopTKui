export interface Item {
    itemId: number;
    quantity: number;
  }
  
  export interface IssueOutInventoryVm {
    movementDate: Date | null;
    storeId: number;
    movementType: string;
    sentBy: string;
    
    destinationStoreId: number;
    destinationLocationId: number;

    items: Item[];
  }
  