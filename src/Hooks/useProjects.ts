import { useCallback, useEffect, useState } from "react";
import type { Project, UpdateProjectRequest, CreateProjectRequest } from "../types/Project";
import * as projectAPI from '../Api/projects.api';


function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');


    const fetchProjetcs = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await projectAPI.getProjects();
            setProjects(data);
        } catch {
            setError("une erreur s'est produite");
        } finally {
            setIsLoading(false);
        }


    }, []);

    useEffect(() => {
        fetchProjetcs();
    }, [fetchProjetcs]);

    const createProject = async (data: CreateProjectRequest) => {
        const project = await projectAPI.createProject(data);
        setProjects((prev) => [project, ...prev]);
        return project;
    }
    const updateProject = async (id: string, data: UpdateProjectRequest) => {
        const project = await projectAPI.updateProject(id, data);
        setProjects((prev) =>
            prev.map((proj) =>
                proj.id === id ? project : proj)
        );
        return project;
    }

    const getProject = async (id: string) => {
        const project = projectAPI.getProject(id);
        return project;
    }

    const deleteProject = async (id: string) => {
        await projectAPI.deleteProjec(id);
        setProjects((prev) => prev.filter((project) => project.id !== id));
    };

    return {
        projects,
        isLoading,
        error,
        fetchProjetcs,
        createProject,
        updateProject,
        getProject,
        deleteProject,
    }


}
export default useProjects;