import type { Project } from '../../types/Project';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: number) => void;
}

function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm(`Supprimer le projet "${project.nom}" ?`)) {
      onDelete(project.id);
    }
  };

  return (
    <Link to={`/projects/${project.id}`} className="group block bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-300 hover:shadow-sm transition-all relative">
      <div className="pr-8">
        <h3 className="text-[15px] font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
          {project.nom}
        </h3>
        <p className="mt-1 text-xs text-gray-400">
          Créé le {new Date(project.createdAt).toLocaleDateString()}
        </p>
      </div>

      <button
        onClick={handleDelete}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </button>
    </Link>
  );
}

export default ProjectCard;
