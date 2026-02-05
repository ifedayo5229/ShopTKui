export interface Profile {
    firstName: string;
    lastName: string;
    fullname: string;
    email: string;
    position: string;
    phoneNumber: string;
    lineManager: string;
    headOfUnit: string;
    headOfFunction: string;
    isEmailConfirmed: boolean;
    isSuperAdmin: boolean;
    departmentId: number;
    designationId: number;
    id: string;
    isActive: boolean;
    roleId:number;
    roleName:string;
    designationName:string;
    departmentName:string;
    isManager:boolean;
    managerId:string;
    functionName:string;
    mustChangePassword:boolean;
  //  createdDate: Date;
}
