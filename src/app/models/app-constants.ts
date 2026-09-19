import { Permission } from "./permissions";
import { UserRole } from "./shop-user";

export class AppConstants {
    public static ItemPerPage: number = 50;
    public static PageSize: number[] = [10, 50, 100, 200, 500];
    public static AllowFiltering: boolean = true;
    public static UserPermission: Permission[] = [];
    public static CurrentUserRole: UserRole | null = null;
    
    public static get IsSuperAdmin(): boolean {
        return this.CurrentUserRole === UserRole.SuperAdmin;
    }

    public static setUserRole(role: UserRole): void {
        this.CurrentUserRole = role;
    }

    public static clearUserRole(): void {
        this.CurrentUserRole = null;
    }
}