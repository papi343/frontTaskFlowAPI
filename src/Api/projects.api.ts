import api from './axios';
import type { Project, CreateProjectRequest, UpdateProjectRequest } from '../types/Project';

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>('/projects');
  return response.data;
};

export const getProject = async (id: number): Promise<Project> => {
  const response = await api.get<Project>(`/projects/${id}`);
  return response.data;
};

export const createProject = async (data: CreateProjectRequest): Promise<Project> => {
  const response = await api.post<Project>('/projects', data);
  return response.data;
};

export const updateProject = async (id: number, data: UpdateProjectRequest): Promise<Project> => {
  const response = await api.patch<Project>(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/projects/${id}`);
};
