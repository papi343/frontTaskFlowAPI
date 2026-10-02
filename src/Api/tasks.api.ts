import api from "./axios";

import type {
    CreateTaskRequest,
    Task,
    UpdateTaskRequest,
} from "../types/task";

export const getTasks = async (projectId: string): Promise<Task[]> => {
    const response = await api.get<Task[]>(`/projects/${projectId}/tasks`);
    return response.data;
}

export const createTask = async (data: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<Task>(`/projects/${data.projectId}/tasks`, data);
    return response.data;
}

export const getTask = async (id: string): Promise<Task> => {
    const response = await api.get<Task>(`task/${id}`);
    return response.data;
}


export const updateTask = async (id: string, data: UpdateTaskRequest): Promise<Task> => {
    const response = await api.patch<Task>(`task/${id}`, data);
    return response.data;
}

export const deleteTask = async (id: string): Promise<void> => {
    await api.delete(`task/${id}`);
}