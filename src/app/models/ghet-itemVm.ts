export interface NewItemVms {
    itemName: string;
    categoryId: number;
    description: string;
    uploadFiles: File[]; // IFormFile[] in C# maps to File[] in TS
  }
  
  export interface GhetItem {
    creatorEmail: string;
    creatorFunctionId: number;
    creatorLocationId: number;
    items: NewItemVms[];
  }