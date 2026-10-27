import type { Task } from '../../types/task';

interface TaskCardProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete?: (taskId: number) => void;
  projectName?: string;
}

function TaskCard({ task, onToggle, onDelete, projectName }: TaskCardProps) {
  return (
    <div
      className={`group flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border transition-all duration-200 ${
        task.complete
          ? 'bg-slate-50/70 border-slate-200/60'
          : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={() => onToggle(task)}
          className={`w-5 h-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all ${
            task.complete
              ? 'bg-slate-900 border-slate-900 text-white'
              : 'border-slate-300 hover:border-slate-800 bg-white'
          }`}
          aria-label={task.complete ? 'Marquer comme non terminée' : 'Marquer comme terminée'}
        >
          {task.complete && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={`text-xs sm:text-sm font-medium transition-colors break-words ${
              task.complete
                ? 'text-slate-400 line-through'
                : 'text-slate-900'
            }`}
          >
            {task.titre}
          </p>
          {projectName && (
            <p className="text-[10px] text-slate-400 mt-0.5">
              Projet : {projectName}
            </p>
          )}
        </div>
      </div>

      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="shrink-0 w-7 h-7 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="Supprimer la tâche"
          aria-label="Supprimer la tâche"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default TaskCard;
