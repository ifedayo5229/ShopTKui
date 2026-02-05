export interface InventoryMovement{
    movementDate: Date | null; 
    itemId: number; 
    itemName: string;
    storeId: number; 
    storeName: string;
    receivedBy: string; 
    quantity: number;
    movementType: string;
    id: number; 
    isActive: boolean; 
    createdDate: string; 
    isDeleted: boolean;
    code: string; 
    costPerUnit: string;
}
