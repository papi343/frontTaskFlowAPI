import { useState } from 'react';
import type { Project } from '../../types/Project';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: number) => void;
  taskCount?: number;
}

function ProjectCard({ project, onDelete, taskCount }: ProjectCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(project.id);
    setConfirmDelete(false);
  };

  const projectInitial = (project.nom[0] || 'P').toUpperCase();

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center shrink-0 border border-slate-200/60">
              {projectInitial}
            </div>
            <div>
              <Link
                to={`/projects/${project.id}`}
                className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-1"
              >
                {project.nom}
              </Link>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Créé le {new Date(project.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          <div className="relative">
            {confirmDelete ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 p-1 bg-rose-50 border border-rose-200 rounded-lg animate-in fade-in duration-150"
              >
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-2 py-0.5 bg-rose-600 text-white text-[11px] font-semibold rounded hover:bg-rose-700 transition-colors"
                >
                  Supprimer
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDelete(false);
                  }}
                  className="px-1.5 py-0.5 text-slate-500 hover:text-slate-800 text-[11px]"
                >
                  Non
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setConfirmDelete(true);
                }}
                className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Supprimer le projet"
                aria-label={`Supprimer le projet ${project.nom}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">
          {taskCount !== undefined ? `${taskCount} ${taskCount > 1 ? 'tâches' : 'tâche'}` : 'Espace actif'}
        </span>

        <Link
          to={`/projects/${project.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors"
        >
          <span>Accéder aux tâches</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default ProjectCard;
