export interface OtherIssuedItemDto {
  id: number;
  name: string;
}

export interface EquipmentForm {
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

  policyAcknowledged: boolean;

  computerHostName: string;
  isEquipmentReturned: boolean;
  additionalComment: string;
  oldSystemHostNameReturned: string;

  items: OtherIssuedItemDto[];
}
