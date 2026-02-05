export interface Item {
    itemName: string;
    creatorEmail: string;
    description: string;
    creatorFunctionId: number;
    creatorLocationId: number;
    categoryName: string;
    creatorFunctionName: string;
    creatorLocationName: string;
    categoryId: number;
    id: number;
    isActive: boolean;
    createdDate: Date;
    isDeleted: boolean;
    code: string;
    costPerUnit: number;
    uploadFiles: UploadFile[];
  }

  export interface UploadFile {
  itemId: number;
  fileName: string;
  filePath: string;
  uploadedAt: Date; 
  id: number;
  isActive: boolean;
  createdDate: Date; 
  isDeleted: boolean;
}