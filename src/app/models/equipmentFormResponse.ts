export interface EquipmentFormResponse {
  issueId: number;
  emailAddress: string;
  employeeName: string;
  employeeIdOrPhoneNumber: string;
  department: string;
  location: string;
  managerName: string;
  managerAlignedConfirmation: boolean;

  equipmentType: string;
  manufacturer: string;
  model: string;
  serialOrPartNumber: string;
  item: string;

  policyAcknowledged: boolean;
  issuedBy: string;
  reviewedBy: string;
  dateIssued: Date;
  computerHostName: string;

  additionalComment: string;
  oldSystemHostNameReturned: string;
  equipmentAcknowledgedByEmployee: boolean;

  items: string[]; // List of issued item names

  id: number;
  isActive: boolean;
  createdDate: Date;
  createdBy: string;
  
}
