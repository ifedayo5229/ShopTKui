export interface ItemDetails {
    itemName: string;
    categoryId: number;
    description: string;
    // costPerUnit: number;
}

export interface CreateItem {
    creatorEmail: string;
    creatorFunctionId: number;
    creatorLocationid: number;
    items: ItemDetails[];
  }