import { useState, useMemo, useEffect } from 'react';
import useProjects from '../../Hooks/useProjects';
import ProjectCard from '../../components/projects/ProjectCard';
import ProjectForm from '../../components/projects/ProjectForm';
import type { CreateProjectRequest } from '../../types/Project';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useToast } from '../../context/ToastContext';
import * as taskAPI from '../../Api/tasks.api';

export default function Projects() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [taskCounts, setTaskCounts] = useState<Record<number, number>>({});
  const { projects, isLoading, error, createProject, deleteProject, fetchProjects } = useProjects();
  const { success, error: toastError } = useToast();

  // Load task counts per project
  useEffect(() => {
    if (projects.length === 0) return;
    const fetchCounts = async () => {
      const counts: Record<number, number> = {};
      await Promise.allSettled(
        projects.map(async (p) => {
          try {
            const tasks = await taskAPI.getTasks(p.id);
            counts[p.id] = tasks.length;
          } catch {
            counts[p.id] = 0;
          }
        })
      );
      setTaskCounts(counts);
    };
    fetchCounts();
  }, [projects]);

  const handleCreate = async (data: CreateProjectRequest) => {
    try {
      await createProject(data);
      setShowModal(false);
      success(`Projet "${data.nom}" créé avec succès !`);
    } catch {
      toastError("Impossible de créer le projet. Vérifiez la connexion.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProject(id);
      success('Projet supprimé.');
    } catch {
      toastError("Impossible de supprimer le projet.");
    }
  };

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    return projects.filter((p) =>
      p.nom.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [projects, searchQuery]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Projets</h2>
            <p className="text-sm text-slate-500 mt-1">Organisez vos espaces de travail et suivez l'avancement.</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-xs active:scale-[0.99]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nouveau projet
          </button>
        </div>

        {/* Backend offline / error alert */}
        {error && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-amber-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-xs font-semibold">{error}</p>
                <p className="text-[11px] text-amber-700">Assurez-vous que l'API est démarrée sur http://localhost:3000</p>
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

        {/* Search & Filter Bar */}
        {projects.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un projet..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              {filteredProjects.length} sur {projects.length} {projects.length > 1 ? 'projets' : 'projet'}
            </span>
          </div>
        )}

        {/* Project Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-36 bg-white rounded-2xl border border-slate-200/80 animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center max-w-lg mx-auto my-6">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Aucun projet pour le moment</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Créez votre premier projet pour commencer à organiser vos tâches en équipe ou en solo.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-xs"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Créer mon premier projet
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center">
            <p className="text-sm font-semibold text-slate-700">Aucun projet ne correspond à "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-xs font-semibold text-slate-900 hover:underline"
            >
              Effacer la recherche
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDelete}
                taskCount={taskCounts[project.id]}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-150">
              <ProjectForm
                onSubmit={handleCreate}
                onCancel={() => setShowModal(false)}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
