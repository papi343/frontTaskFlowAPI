import { useCallback, useEffect, useState } from "react";
import type { Task, CreateTaskRequest, UpdateTaskRequest } from "../types/task";
import * as taskAPI from "../Api/tasks.api";






function useTasks(projectId: string) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchTasks = useCallback(async () => {
        try {
            setIsLoading(true);
            setError('');
            const data = await taskAPI.getTasks(projectId);
            setTasks(data);
        } catch {
            setError("une erreur s'est produite");
        } finally {
            setIsLoading(false);
        }

    }, [projectId])

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);


    const createTask = async (data: CreateTaskRequest) => {
        const task = await taskAPI.createTask(data);

        setTasks((prev) => [task, ...prev]);
    };

    const updateTask = async (id: string, data: UpdateTaskRequest) => {
        const updatedTask = await taskAPI.updateTask(id, data);

        setTasks((prev) =>
            prev.map((ta) => ta.id === id ? updatedTask : ta));
    };

    const deleteTask = async (id: string) => {
        await taskAPI.deleteTask(id);
        setTasks((prev) => prev.filter((ta) => ta.id !== id));
    };

    const getTask = async (id: string) => {
        const task = await taskAPI.getTask(id);
        return task;
    };

    return {
        tasks,
        isLoading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        getTask,
    }


}
export default useTasks;