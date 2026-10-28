import api from './axios';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/Auth';

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

// Register goes to POST /users (backend doesn't have /auth/register)
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  // First create the user
  await api.post('/users', data);
  // Then login to get the token
  const loginResponse = await api.post<AuthResponse>('/auth/login', {
    email: data.email,
    password: data.password,
  });
  return loginResponse.data;
};
