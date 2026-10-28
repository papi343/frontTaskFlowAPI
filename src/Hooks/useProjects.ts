import { useCallback, useEffect, useState } from 'react';
import type { Project, CreateProjectRequest, UpdateProjectRequest } from '../types/Project';
import * as projectAPI from '../Api/projects.api';
import { getApiErrorMessage } from '../Api/axios';

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
    } catch (err) {
      setError(getApiErrorMessage(err, "Impossible de charger les projets."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const createProject = async (data: CreateProjectRequest) => {
    try {
      const project = await projectAPI.createProject(data);
      setProjects((prev) => [project, ...prev]);
      return project;
    } catch (err) {
      const msg = getApiErrorMessage(err, "Impossible de créer le projet.");
      setError(msg);
      throw new Error(msg);
    }
  };

  const updateProject = async (id: number, data: UpdateProjectRequest) => {
    try {
      const project = await projectAPI.updateProject(id, data);
      setProjects((prev) => prev.map((p) => (p.id === id ? project : p)));
      return project;
    } catch (err) {
      const msg = getApiErrorMessage(err, "Impossible de modifier le projet.");
      setError(msg);
      throw new Error(msg);
    }
  };

  const getProject = async (id: number) => {
    return projectAPI.getProject(id);
  };

  const deleteProject = async (id: number) => {
    try {
      await projectAPI.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      const msg = getApiErrorMessage(err, "Impossible de supprimer le projet.");
      setError(msg);
      throw new Error(msg);
    }
  };

  return { projects, isLoading, error, fetchProjects, createProject, updateProject, getProject, deleteProject };
}

export default useProjects;