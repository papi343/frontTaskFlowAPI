import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';

function TaskDetails() {
  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl border border-slate-200/80 p-8 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-2">Gestion centralisée des tâches</h3>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Toutes les tâches et leurs détails sont désormais directement modifiables et consultables depuis le hub central des tâches ou au sein de leur projet respectif.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/tasks"
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Voir toutes les tâches
          </Link>
          <Link
            to="/projects"
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Liste des projets
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TaskDetails;