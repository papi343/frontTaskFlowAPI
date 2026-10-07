import { useCallback, useEffect, useState } from 'react';
import type { Task, CreateTaskRequest } from '../types/task';
import * as taskAPI from '../Api/tasks.api';

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
    } catch {
      setError("Impossible de charger les tâches.");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (data: CreateTaskRequest) => {
    const task = await taskAPI.createTask(data);
    setTasks((prev) => [task, ...prev]);
    return task;
  };

  const toggleTask = async (task: Task) => {
    const updated = await taskAPI.updateTask(task.projectId, task.id, { complete: !task.complete });
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    return updated;
  };

  return { tasks, isLoading, error, fetchTasks, createTask, toggleTask };
}

export default useTasks;