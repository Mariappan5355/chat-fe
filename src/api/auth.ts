// src/api/auth.ts
import axios from 'axios';
import api from './axios';


interface LoginResponse {
    token: string;
}

export interface UserResponse {
    id: number;
    name: string;
    email: string
}

export interface UserListResponse {
    id: number;
    name: string;
    email: string;
    request_status: string;
}

export const login = async (email: string, password: string): Promise<void> => {
    try {
        const response = await api.post<LoginResponse>('/user/login', {
            email,
            password,
        });

        const { token } = response.data;
        localStorage.setItem('token', token);
    } catch (error) {
        let errorMessage = 'Failed to login';
        if (axios.isAxiosError(error) && error.response) {
            errorMessage = error.response.data?.error || errorMessage;
        }
        throw new Error(errorMessage);
    }
};

export const signup = async (username: string, email: string, password: string): Promise<void> => {
    try {
        await api.post<any>('/user/register', {
            username,
            email,
            password,
        });

    } catch (error) {
        let errorMessage = 'Failed to signup';
        if (axios.isAxiosError(error) && error.response) {
            errorMessage = error.response.data?.error || errorMessage;
        }
        throw new Error(errorMessage);
    }
}

export const getAllUsers = async (page: number, pageSize: number): Promise<{ data: UserListResponse[], pagination: any }> => {
    try {
        const response = await api.get<{ data: UserListResponse[], pagination: any }>(`/user/allUsers?page=${page}&pageSize=${pageSize}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch all users');
    }
};
export const getUser = async (): Promise<UserResponse> => {
    try {
        const response = await api.get<UserResponse>('/user/info');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch user information');
    }
};

