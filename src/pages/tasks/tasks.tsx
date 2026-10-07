import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useProjects from '../../Hooks/useProjects';

function Tasks() {
  const { projects, isLoading } = useProjects();

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Tâches</h2>
          <p className="mt-1 text-sm text-gray-500">Sélectionnez un projet pour voir et gérer ses tâches.</p>
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500">Chargement des projets...</p>
        ) : projects.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-8 text-center">
            <p className="text-sm text-gray-500 mb-4">Vous n'avez pas de projets.</p>
            <Link to="/projects" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg">
              Aller aux projets
            </Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <span className="font-medium text-gray-900">{project.nom}</span>
                <span className="text-sm text-gray-500 flex items-center">
                  Gérer les tâches
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Tasks;