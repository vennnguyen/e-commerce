export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  phone?: string | null;
  emailVerified?: boolean;
  role?: string;
  birthday?: string | null;
  gender?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SignUpDto {
  email: string;
  password: string;
  name: string;
  confirmPassword?: string;
}
export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}
