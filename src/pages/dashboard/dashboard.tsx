import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { UseAuth } from '../../Hooks/UseAuth';
import useProjects from '../../Hooks/useProjects';
import * as taskAPI from '../../Api/tasks.api';
import type { Task } from '../../types/task';
import { useToast } from '../../context/ToastContext';
import ProjectForm from '../../components/projects/ProjectForm';
import type { CreateProjectRequest } from '../../types/Project';

interface TaskWithProject extends Task {
  projectName?: string;
}

export default function Dashboard() {
  const { user } = UseAuth();
  const { success, error: toastError } = useToast();
  const { projects, isLoading: projectsLoading, error: projectsError, fetchProjects, createProject } = useProjects();

  const [allTasks, setAllTasks] = useState<TaskWithProject[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch tasks for all projects to compute live metrics & list recent tasks
  const loadAllTasks = useCallback(async () => {
    if (projects.length === 0) {
      setAllTasks([]);
      return;
    }

    setTasksLoading(true);
    try {
      const results = await Promise.allSettled(
        projects.map(async (project) => {
          const tasks = await taskAPI.getTasks(project.id);
          return tasks.map((t) => ({ ...t, projectName: project.nom }));
        })
      );

      const combined: TaskWithProject[] = [];
      results.forEach((res) => {
        if (res.status === 'fulfilled') {
          combined.push(...res.value);
        }
      });

      setAllTasks(combined);
    } catch {
      // Graceful degradation
    } finally {
      setTasksLoading(false);
    }
  }, [projects]);

  useEffect(() => {
    loadAllTasks();
  }, [loadAllTasks]);

  // Toggle task completion directly from the Dashboard
  const handleToggleTask = async (task: TaskWithProject) => {
    try {
      const updated = await taskAPI.updateTask(task.projectId, task.id, {
        complete: !task.complete,
      });

      setAllTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, complete: updated.complete } : t))
      );

      if (updated.complete) {
        success(`Tâche "${task.titre}" terminée !`);
      }
    } catch {
      toastError("Impossible de mettre à jour la tâche.");
    }
  };

  const handleCreateProject = async (data: CreateProjectRequest) => {
    try {
      await createProject(data);
      setShowCreateModal(false);
      success(`Projet "${data.nom}" créé avec succès !`);
    } catch {
      toastError("Erreur lors de la création du projet.");
    }
  };

  // Live Metrics
  const totalProjects = projects.length;
  const totalTasks = allTasks.length;
  const pendingTasks = allTasks.filter((t) => !t.complete);
  const completedTasks = allTasks.filter((t) => t.complete);
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const displayName = user?.prenom ? `${user.prenom} ${user.nom || ''}`.trim() : (user?.nom || 'Collaborateur');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Connection Notice / Error state */}
        {projectsError && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-amber-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-xs font-semibold">{projectsError}</p>
                <p className="text-[11px] text-amber-700">Vérifiez que votre API est lancée sur http://localhost:3000</p>
              </div>
            </div>
            <button
              onClick={() => fetchProjects()}
              className="px-3 py-1.5 bg-amber-200/60 hover:bg-amber-200 text-amber-900 text-xs font-medium rounded-lg transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Bonjour, {displayName}
              </h2>
              <span className="hidden sm:inline-block text-xl">👋</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Voici l'état d'avancement réel de vos espaces de travail aujourd'hui.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-xs active:scale-[0.99]"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nouveau projet
            </button>
          </div>
        </div>

        {/* Dynamic Live Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Projects */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Projets Actifs</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-slate-900">
                {projectsLoading ? '...' : totalProjects}
              </span>
              <p className="text-xs text-slate-500 mt-1">Espaces configurés</p>
            </div>
          </div>

          {/* Card 2: Tasks to do */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tâches À Faire</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-amber-600">
                {tasksLoading ? '...' : pendingTasks.length}
              </span>
              <p className="text-xs text-slate-500 mt-1">En attente de réalisation</p>
            </div>
          </div>

          {/* Card 3: Completed tasks */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tâches Terminées</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-emerald-600">
                {tasksLoading ? '...' : completedTasks.length}
              </span>
              <p className="text-xs text-slate-500 mt-1">Sur un total de {totalTasks}</p>
            </div>
          </div>

          {/* Card 4: Global Completion Rate */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Taux Global</span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl font-extrabold text-slate-900">{completionRate}%</span>
                <span className="text-xs font-semibold text-slate-400">{completedTasks.length}/{totalTasks || 0}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-slate-900 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Two-column layout: Recent Projects & Urgent Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Recent Projects */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Vos Projets</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  {projects.length}
                </span>
              </div>
              <Link to="/projects" className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                Gérer les projets →
              </Link>
            </div>

            {projectsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-white rounded-2xl border border-slate-200/80 animate-pulse" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h4 className="text-sm font-semibold text-slate-800">Aucun projet configuré</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">Créez votre premier projet pour commencer à organiser vos tâches.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-3.5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Créer un projet
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 4).map((project) => {
                  const projectTasks = allTasks.filter((t) => t.projectId === project.id);
                  const projectDone = projectTasks.filter((t) => t.complete).length;
                  const percent = projectTasks.length > 0 ? Math.round((projectDone / projectTasks.length) * 100) : 0;

                  return (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="group block bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                            {project.nom}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Créé le {new Date(project.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {projectTasks.length} {projectTasks.length > 1 ? 'tâches' : 'tâche'}
                        </span>
                      </div>

                      {projectTasks.length > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                            <span>Progression</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-slate-800 h-1.5 rounded-full transition-all"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Pending / Quick Action Tasks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Tâches Prioritaires</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200/60">
                  {pendingTasks.length} en attente
                </span>
              </div>
              <Link to="/tasks" className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                Toutes les tâches →
              </Link>
            </div>

            {tasksLoading ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-white rounded-xl border border-slate-200/80 animate-pulse" />
                ))}
              </div>
            ) : pendingTasks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h4 className="text-sm font-semibold text-slate-800">Tout est à jour !</h4>
                <p className="text-xs text-slate-500 mt-1">Vous n'avez aucune tâche en attente. Profitez-en ou créez-en une nouvelle.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => handleToggleTask(task)}
                        className="w-5 h-5 rounded-md border-2 border-slate-300 hover:border-slate-800 flex items-center justify-center shrink-0 transition-colors"
                        title="Marquer comme terminée"
                        aria-label={`Terminer ${task.titre}`}
                      />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">{task.titre}</p>
                        {task.projectName && (
                          <p className="text-[10px] text-slate-400 font-medium truncate">
                            Projet : {task.projectName}
                          </p>
                        )}
                      </div>
                    </div>

                    <Link
                      to={`/projects/${task.projectId}`}
                      className="shrink-0 text-slate-400 hover:text-slate-700 p-1 text-xs"
                      title="Ouvrir le projet"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create Project Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-150">
              <ProjectForm
                onSubmit={handleCreateProject}
                onCancel={() => setShowCreateModal(false)}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}