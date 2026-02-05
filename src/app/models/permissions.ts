export interface Permission {
    roleId: number;
    permissionId: number;
    canAdd: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canRead: boolean;
    canApprove:boolean;
    canTerminate:boolean;
    permissionName: string;
    roleName: string;
    id: number;
    isActive: boolean;
    createdDate: Date;
}
