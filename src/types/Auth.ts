export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  roleId: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  roleId: number;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}