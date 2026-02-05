export interface Item {
    itemId: number;
    quantity: number;
  }
  
  export interface InventoryMovtVm {
    movementDate: Date | null;
    storeId: number;
    receivedBy: string;
    movementType: string;
    items: Item[];
  }
  