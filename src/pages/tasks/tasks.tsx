import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useProjects from '../../Hooks/useProjects';
import * as taskAPI from '../../Api/tasks.api';
import type { Task } from '../../types/task';
import TaskCard from '../../components/tasks/TaskCard';
import { useToast } from '../../context/ToastContext';

interface TaskWithProject extends Task {
  projectName: string;
}

export default function Tasks() {
  const { projects, isLoading: projectsLoading } = useProjects();
  const { success, error: toastError } = useToast();

  const [tasks, setTasks] = useState<TaskWithProject[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'done'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick task creation form state
  const [newTitle, setNewTitle] = useState('');
  const [targetProjectId, setTargetProjectId] = useState<number | ''>('');
  const [isCreating, setIsCreating] = useState(false);

  // Set default targetProjectId when projects load
  useEffect(() => {
    if (projects.length > 0 && targetProjectId === '') {
      setTargetProjectId(projects[0].id);
    }
  }, [projects, targetProjectId]);

  const loadAllTasks = useCallback(async () => {
    if (projects.length === 0) {
      setTasks([]);
      setTasksLoading(false);
      return;
    }

    setTasksLoading(true);
    try {
      const results = await Promise.allSettled(
        projects.map(async (project) => {
          const projectTasks = await taskAPI.getTasks(project.id);
          return projectTasks.map((t) => ({ ...t, projectName: project.nom }));
        })
      );

      const combined: TaskWithProject[] = [];
      results.forEach((res) => {
        if (res.status === 'fulfilled') {
          combined.push(...res.value);
        }
      });

      setTasks(combined);
    } catch {
      toastError("Erreur lors de la récupération des tâches.");
    } finally {
      setTasksLoading(false);
    }
  }, [projects, toastError]);

  useEffect(() => {
    loadAllTasks();
  }, [loadAllTasks]);

  const handleToggle = async (task: Task) => {
    try {
      const updated = await taskAPI.updateTask(task.projectId, task.id, {
        complete: !task.complete,
      });

      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, complete: updated.complete } : t))
      );

      if (updated.complete) {
        success(`Tâche terminée !`);
      }
    } catch {
      toastError("Impossible de modifier le statut de la tâche.");
    }
  };

  const handleDelete = async (projectId: number, taskId: number) => {
    try {
      await taskAPI.deleteTask(projectId, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      success("Tâche supprimée.");
    } catch {
      toastError("Impossible de supprimer la tâche.");
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const projId = selectedProjectId !== 'all' ? selectedProjectId : targetProjectId;
    if (!projId) {
      toastError("Veuillez sélectionner un projet cible.");
      return;
    }

    setIsCreating(true);
    try {
      const created = await taskAPI.createTask({
        titre: newTitle.trim(),
        projectId: Number(projId),
      });

      const parentProject = projects.find((p) => p.id === Number(projId));
      const withProject: TaskWithProject = {
        ...created,
        projectName: parentProject?.nom || 'Projet',
      };

      setTasks((prev) => [withProject, ...prev]);
      setNewTitle('');
      success("Tâche ajoutée avec succès !");
    } catch {
      toastError("Impossible d'ajouter la tâche.");
    } finally {
      setIsCreating(false);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Filter by project
      if (selectedProjectId !== 'all' && t.projectId !== selectedProjectId) {
        return false;
      }
      // Filter by status
      if (statusFilter === 'todo' && t.complete) return false;
      if (statusFilter === 'done' && !t.complete) return false;
      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = t.titre.toLowerCase().includes(query);
        const matchesProject = t.projectName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesProject) return false;
      }
      return true;
    });
  }, [tasks, selectedProjectId, statusFilter, searchQuery]);

  const total = tasks.length;
  const pendingCount = tasks.filter((t) => !t.complete).length;
  const doneCount = tasks.filter((t) => t.complete).length;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Tâches</h2>
            <p className="text-sm text-slate-500 mt-1">
              Visualisez et gérez l'ensemble de vos tâches à travers tous vos projets.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {total} au total
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
              {pendingCount} à faire
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              {doneCount} terminées
            </span>
          </div>
        </div>

        {/* Quick Add Bar */}
        {projects.length > 0 && (
          <form
            onSubmit={handleCreateTask}
            className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
          >
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Que devez-vous accomplir ?"
              className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 outline-none transition-all placeholder:text-slate-400"
            />

            {selectedProjectId === 'all' && (
              <select
                value={targetProjectId}
                onChange={(e) => setTargetProjectId(Number(e.target.value))}
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 outline-none focus:border-slate-900"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    Projet : {p.nom}
                  </option>
                ))}
              </select>
            )}

            <button
              type="submit"
              disabled={isCreating || !newTitle.trim()}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors shrink-0 flex items-center justify-center gap-1.5"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>{isCreating ? 'Ajout...' : 'Ajouter'}</span>
            </button>
          </form>
        )}

        {/* Filters and search controls */}
        {projects.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            {/* Project dropdown & Status Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedProjectId}
                onChange={(e) =>
                  setSelectedProjectId(
                    e.target.value === 'all' ? 'all' : Number(e.target.value)
                  )
                }
                className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 outline-none focus:border-slate-900 shadow-xs"
              >
                <option value="all">Tous les projets ({projects.length})</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nom}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    statusFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setStatusFilter('todo')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    statusFilter === 'todo'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  À faire
                </button>
                <button
                  onClick={() => setStatusFilter('done')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    statusFilter === 'done'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Terminées
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une tâche..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:border-slate-900 outline-none"
              />
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Task List */}
        {projectsLoading || tasksLoading ? (
          <div className="space-y-2.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-white rounded-xl border border-slate-200/80 animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">Aucun projet trouvé</h4>
            <p className="text-xs text-slate-500 mb-5">
              Vous devez avoir au moins un projet pour créer et organiser des tâches.
            </p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Créer un projet
            </Link>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center text-xs text-slate-500">
            {searchQuery ? (
              <p>Aucune tâche ne correspond à votre recherche "{searchQuery}".</p>
            ) : statusFilter === 'todo' ? (
              <p>Bravo ! Aucune tâche en attente dans ce filtre.</p>
            ) : statusFilter === 'done' ? (
              <p>Aucune tâche terminée pour l'instant.</p>
            ) : (
              <p>Aucune tâche dans ce projet. Ajoutez-en une ci-dessus !</p>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                projectName={selectedProjectId === 'all' ? task.projectName : undefined}
                onToggle={handleToggle}
                onDelete={(taskId) => handleDelete(task.projectId, taskId)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}