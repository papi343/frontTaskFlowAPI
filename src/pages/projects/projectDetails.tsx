import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import TaskForm from '../../components/tasks/TaskForm';
import TaskCard from '../../components/tasks/TaskCard';
import useTasks from '../../Hooks/useTasks';
import useProjects from '../../Hooks/useProjects';
import { useToast } from '../../context/ToastContext';
import type { CreateTaskRequest } from '../../types/task';

export default function ProjectDetails() {
  const { id } = useParams();
  const projectId = Number(id);
  const { getProject, updateProject } = useProjects();
  const { tasks, isLoading, error, createTask, toggleTask, deleteTask } = useTasks(projectId);
  const { success, error: toastError } = useToast();

  const [project, setProject] = useState<{ id: number; nom: string; createdAt?: string } | null>(null);
  const [projectError, setProjectError] = useState('');
  const [filter, setFilter] = useState<'all' | 'todo' | 'done'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Project inline edit
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    if (!isNaN(projectId)) {
      getProject(projectId)
        .then((p) => {
          setProject(p);
          setEditedTitle(p.nom);
        })
        .catch(() => setProjectError("Impossible de charger les détails du projet."));
    } else {
      setProjectError("Identifiant de projet invalide.");
    }
  }, [projectId, getProject]);

  const handleSaveTitle = async () => {
    if (!editedTitle.trim() || !project) return;
    try {
      const updated = await updateProject(project.id, { nom: editedTitle.trim() });
      setProject(updated);
      setIsEditingTitle(false);
      success("Titre du projet mis à jour.");
    } catch {
      toastError("Erreur lors de la modification du nom.");
    }
  };

  const handleCreateTask = async (data: CreateTaskRequest) => {
    try {
      await createTask(data);
      success("Tâche ajoutée avec succès !");
    } catch {
      toastError("Impossible d'ajouter la tâche.");
    }
  };

  const handleToggle = async (task: Parameters<typeof toggleTask>[0]) => {
    try {
      const updated = await toggleTask(task);
      if (updated.complete) {
        success("Tâche marquée comme terminée !");
      }
    } catch {
      toastError("Impossible de mettre à jour le statut.");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      success("Tâche supprimée.");
    } catch {
      toastError("Impossible de supprimer la tâche.");
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.complete);
  const pendingTasks = tasks.filter((t) => !t.complete);
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const filteredTasks = useMemo(() => {
    let list = tasks;
    if (filter === 'todo') list = list.filter((t) => !t.complete);
    if (filter === 'done') list = list.filter((t) => t.complete);
    if (searchQuery.trim()) {
      list = list.filter((t) =>
        t.titre.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
    }
    return list;
  }, [tasks, filter, searchQuery]);

  if (projectError) {
    return (
      <DashboardLayout>
        <div className="bg-white border border-rose-200 p-8 text-center rounded-2xl max-w-lg mx-auto my-12">
          <p className="text-sm font-semibold text-rose-600 mb-4">{projectError}</p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            ← Retour à la liste des projets
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Retour aux projets
          </Link>
        </div>

        {/* Project Header Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <div className="flex items-center gap-2 max-w-md">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    autoFocus
                    className="flex-1 px-3 py-1.5 text-lg font-bold rounded-lg border border-slate-300 focus:border-slate-900 outline-none"
                  />
                  <button
                    onClick={handleSaveTitle}
                    className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingTitle(false);
                      setEditedTitle(project?.nom || '');
                    }}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 text-xs font-medium rounded-lg"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 group">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight truncate">
                    {project ? project.nom : 'Chargement du projet...'}
                  </h2>
                  {project && (
                    <button
                      onClick={() => setIsEditingTitle(true)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
                      title="Renommer le projet"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              {project?.createdAt && (
                <p className="text-xs text-slate-400 mt-1">
                  Créé le {new Date(project.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                </p>
              )}
            </div>

            {/* Progress indicator */}
            <div className="w-full sm:w-48 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Progression</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-slate-900 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 text-right">
                {completedTasks.length} sur {totalTasks} terminées
              </p>
            </div>
          </div>
        </div>

        {/* Task Form */}
        {!isNaN(projectId) && (
          <TaskForm projectId={projectId} onSubmit={handleCreateTask} />
        )}

        {/* Errors */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        {/* Filters and search */}
        {totalTasks > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            {/* Filter tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl max-w-fit">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Toutes ({totalTasks})
              </button>
              <button
                onClick={() => setFilter('todo')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filter === 'todo'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                À faire ({pendingTasks.length})
              </button>
              <button
                onClick={() => setFilter('done')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filter === 'done'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Terminées ({completedTasks.length})
              </button>
            </div>

            {/* Search */}
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrer les tâches..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:border-slate-900 outline-none"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Task List */}
        {isLoading ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-white rounded-xl border border-slate-200/80 animate-pulse" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Aucune tâche pour le moment</h4>
            <p className="text-xs text-slate-500">
              Ajoutez votre première tâche ci-dessus pour planifier votre travail.
            </p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-xs text-slate-500">
            Aucune tâche ne correspond à vos filtres actuels.
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}