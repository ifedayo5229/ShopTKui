export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    locationId?: number,
    locationName?: string,
    functionId?: number,
    functionName?: string,
    roles: any;
}