import DashboardLayout from '../../components/layout/DashboardLayout';
import { UseAuth } from '../../Hooks/UseAuth';
import useProjects from '../../Hooks/useProjects';

import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = UseAuth();
  const { projects, isLoading: projectsLoading } = useProjects();
  
  // Quick stats
  const totalProjects = projects.length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Bonjour, {user?.prenom || user?.nom} !
          </h2>
          <p className="mt-1 text-sm text-gray-500">Voici un aperçu de vos projets aujourd'hui.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
            <span className="text-sm font-medium text-gray-500 mb-1">Projets actifs</span>
            <span className="text-3xl font-semibold text-gray-900">{projectsLoading ? '-' : totalProjects}</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
            <span className="text-sm font-medium text-gray-500 mb-1">Tâches en attente</span>
            <span className="text-3xl font-semibold text-gray-900">--</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
            <span className="text-sm font-medium text-gray-500 mb-1">Taux de complétion</span>
            <span className="text-3xl font-semibold text-gray-900">--%</span>
          </div>
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Projets récents</h3>
            <Link to="/projects" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Voir tout →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectsLoading ? (
              <p className="text-sm text-gray-500">Chargement...</p>
            ) : projects.length === 0 ? (
              <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-8 text-center">
                <p className="text-sm text-gray-500 mb-4">Vous n'avez pas encore de projet.</p>
                <Link to="/projects" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
                  Créer mon premier projet
                </Link>
              </div>
            ) : (
              projects.slice(0, 4).map((project) => (
                <Link key={project.id} to={`/projects/${project.id}`} className="block bg-white p-5 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all">
                  <h4 className="font-medium text-gray-900">{project.nom}</h4>
                  <p className="mt-1 text-xs text-gray-400">Créé le {new Date(project.createdAt).toLocaleDateString()}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}