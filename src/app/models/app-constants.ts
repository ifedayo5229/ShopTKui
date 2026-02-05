import { Permission } from "./permissions";

export class AppConstants {
    public static ItemPerPage: number = 50;
    public static PageSize: number[] = [10, 50, 100, 200, 500];
    public static AllowFiltering: boolean = true;
    public static UserPermission:Permission[]= [];
    public static IsSuperAdmin: boolean = true;
    
}