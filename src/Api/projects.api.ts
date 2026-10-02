import api from "./axios";

import type { Project, CreateProjectRequest, UpdateProjectRequest } from '../types/Project';

export const getProjects = async (): Promise<Project[]> => {
    const response = await api.get<Project[]>('/projects');
    return response.data;
}

export const getProject = async (id: string): Promise<Project> => {
    const response = await api.get<Project>(`/project/${id}`);
    return response.data;
}
export const createProject = async (data: CreateProjectRequest): Promise<Project> => {
    const response = await api.post<Project>("/project", data);
    return response.data;

}

export const updateProject = async (id: string, data: UpdateProjectRequest): Promise<Project> => {
    const response = await api.patch<Project>(`/project/${id}`, data);
    return response.data;

}

export const deleteProjec = async (id: string): Promise<void> => {
    await api.delete(`/project/${id}`);
}
