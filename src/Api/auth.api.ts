import api from "./axios";
import type { LoginRequest, RegisterRequest, AuthResponse } from "../types/Auth";



export const login = async (data: LoginRequest): Promise<AuthResponse> => {

    const reponse = await api.post<AuthResponse>('/auth/login', data,);
    return reponse.data;
}

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
}
