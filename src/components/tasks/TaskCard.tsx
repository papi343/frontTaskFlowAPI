import type { Task } from '../../types/task';

interface TaskCardProps {
  task: Task;
  onToggle: (task: Task) => void;
}

function TaskCard({ task, onToggle }: TaskCardProps) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
      task.complete ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200 shadow-sm'
    }`}>
      <button
        onClick={() => onToggle(task)}
        className={`w-6 h-6 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-colors ${
          task.complete ? 'bg-gray-900 border-gray-900' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        {task.complete && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>
      
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate transition-colors ${
          task.complete ? 'text-gray-400 line-through' : 'text-gray-900'
        }`}>
          {task.titre}
        </p>
      </div>
    </div>
  );
}

export default TaskCard;
