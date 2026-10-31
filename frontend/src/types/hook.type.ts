import { User } from "better-auth";

export type AuthMeResponse = {
  success: boolean;
  authenticated: boolean;
  user?: User;
};

export type AuthSession= {
    user: User | null; 
    isGuest: boolean;
    isAuthenticated: boolean;
}