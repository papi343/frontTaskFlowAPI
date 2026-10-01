import { createContext, useEffect, useState, type ReactNode } from "react";
import * as authApi from "../Api/auth.api";
import type { User } from "../types/Auth";



interface AuthContextValue {
    user: User | null;
    IsAuthentificated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>
    register: (
        name: string,
        email: string,
        password: string,
    ) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined,);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setLoading] = useState(true);


    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);

    }, []);
    const login = async (email: string, password: string) => {
        const response = await authApi.login({ email, password });

        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('accessToken', response.token);

        setUser(response.user);

    }

    const register = async (
        name: string,
        email: string,
        password: string,
    ) => {
        const response = await authApi.register({ name, email, password });
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('accessToken', response.token);
        setUser(response.user);

    }

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{
            user,
            IsAuthentificated: !!user,
            isLoading,
            login,
            register,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}