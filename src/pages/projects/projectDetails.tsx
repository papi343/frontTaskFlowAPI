import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import TaskForm from '../../components/tasks/TaskForm';
import TaskCard from '../../components/tasks/TaskCard';
import useTasks from '../../Hooks/useTasks';
import useProjects from '../../Hooks/useProjects';

export default function ProjectDetails() {
  const { id } = useParams();
  const projectId = Number(id);
  const { getProject } = useProjects();
  
  const [project, setProject] = useState<{ id: number, nom: string } | null>(null);
  const [projectError, setProjectError] = useState('');

  const { tasks, isLoading, error, createTask, toggleTask } = useTasks(projectId);

  useEffect(() => {
    if (!isNaN(projectId)) {
      getProject(projectId)
        .then(setProject)
        .catch(() => setProjectError("Impossible de charger les détails du projet."));
    } else {
      setProjectError("ID de projet invalide.");
    }
  }, [projectId, getProject]);

  if (projectError) {
    return (
      <DashboardLayout>
        <div className="bg-white border border-red-100 p-8 text-center rounded-xl">
          <p className="text-red-600 mb-4">{projectError}</p>
          <Link to="/projects" className="text-sm font-medium text-gray-900 hover:underline">
            ← Retour aux projets
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const tasksTodo = tasks.filter(t => !t.complete);
  const tasksDone = tasks.filter(t => t.complete);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <Link to="/projects" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Tous les projets
          </Link>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
            {project ? project.nom : 'Chargement...'}
          </h2>
        </div>

        {/* Task Form */}
        {!isNaN(projectId) && (
          <TaskForm projectId={projectId} onSubmit={createTask} />
        )}

        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Tasks Lists */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse"></div>)}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">Aucune tâche pour le moment. Ajoutez-en une ci-dessus !</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* À faire */}
            {tasksTodo.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 px-1">
                  À faire ({tasksTodo.length})
                </h3>
                <div className="space-y-2">
                  {tasksTodo.map(task => (
                    <TaskCard key={task.id} task={task} onToggle={toggleTask} />
                  ))}
                </div>
              </div>
            )}

            {/* Terminées */}
            {tasksDone.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 px-1">
                  Terminées ({tasksDone.length})
                </h3>
                <div className="space-y-2 opacity-60">
                  {tasksDone.map(task => (
                    <TaskCard key={task.id} task={task} onToggle={toggleTask} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}