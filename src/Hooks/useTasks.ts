import { useCallback, useEffect, useState } from 'react';
import type { Task, CreateTaskRequest } from '../types/task';
import * as taskAPI from '../Api/tasks.api';
import { getApiErrorMessage } from '../Api/axios';

function useTasks(projectId: number) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError('');
    try {
      const data = await taskAPI.getTasks(projectId);
      setTasks(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Impossible de charger les tâches."));
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (data: CreateTaskRequest) => {
    try {
      const task = await taskAPI.createTask(data);
      setTasks((prev) => [task, ...prev]);
      return task;
    } catch (err) {
      const msg = getApiErrorMessage(err, "Impossible de créer la tâche.");
      setError(msg);
      throw new Error(msg);
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      const updated = await taskAPI.updateTask(task.projectId, task.id, { complete: !task.complete });
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      return updated;
    } catch (err) {
      const msg = getApiErrorMessage(err, "Impossible de mettre à jour la tâche.");
      setError(msg);
      throw new Error(msg);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      await taskAPI.deleteTask(projectId, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      const msg = getApiErrorMessage(err, "Impossible de supprimer la tâche.");
      setError(msg);
      throw new Error(msg);
    }
  };

  return { tasks, isLoading, error, fetchTasks, createTask, toggleTask, deleteTask };
}

export default useTasks;