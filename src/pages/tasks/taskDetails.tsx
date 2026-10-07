import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';

function TaskDetails() {
  return (
    <DashboardLayout>
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Les détails de la tâche sont désormais gérés directement dans le projet.</p>
        <Link to="/projects" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100">
          Retour aux projets
        </Link>
      </div>
    </DashboardLayout>
  );
}

export default TaskDetails;