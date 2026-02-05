import { Permission } from "./permissions";
import { Profile } from "./profile";


export interface LoginResponseData {
    accessToken: string;
    refreshToken:string;
    expiredIn: number;
    profile: Profile;
    fullNamme:string
    permission:Permission[];
}