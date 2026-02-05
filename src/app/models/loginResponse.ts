import { User } from "./user";

export interface LoginResponse {
    accessToken: string;
    profile: User;
}