import { useCallback, useEffect, useState } from 'react';
import type { Project, CreateProjectRequest, UpdateProjectRequest } from '../types/Project';
import * as projectAPI from '../Api/projects.api';

function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await projectAPI.getProjects();
      setProjects(data);
    } catch {
      setError("Impossible de charger les projets.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const createProject = async (data: CreateProjectRequest) => {
    const project = await projectAPI.createProject(data);
    setProjects((prev) => [project, ...prev]);
    return project;
  };

  const updateProject = async (id: number, data: UpdateProjectRequest) => {
    const project = await projectAPI.updateProject(id, data);
    setProjects((prev) => prev.map((p) => (p.id === id ? project : p)));
    return project;
  };

  const getProject = async (id: number) => {
    return projectAPI.getProject(id);
  };

  const deleteProject = async (id: number) => {
    await projectAPI.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return { projects, isLoading, error, fetchProjects, createProject, updateProject, getProject, deleteProject };
}

export default useProjects;