import api from './axios';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/task';

export const getTasks = async (projectId: number): Promise<Task[]> => {
  const response = await api.get<Task[]>(`/projects/${projectId}/tasks`);
  return response.data;
};

export const createTask = async (data: CreateTaskRequest): Promise<Task> => {
  const response = await api.post<Task>(`/projects/${data.projectId}/tasks`, {
    titre: data.titre,
  });
  return response.data;
};

export const getTask = async (projectId: number, taskId: number): Promise<Task> => {
  const response = await api.get<Task>(`/projects/${projectId}/tasks/${taskId}`);
  return response.data;
};

export const updateTask = async (projectId: number, taskId: number, data: UpdateTaskRequest): Promise<Task> => {
  const response = await api.patch<Task>(`/projects/${projectId}/tasks/${taskId}`, data);
  return response.data;
};