import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateTaskRequest } from '../../types/task';

const schema = z.object({
  titre: z.string().min(2, 'Le titre de la tâche est requis'),
});

type TaskFormData = z.infer<typeof schema>;

interface TaskFormProps {
  projectId: number;
  onSubmit: (data: CreateTaskRequest) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

function TaskForm({ projectId, onSubmit, isSubmitting = false, onCancel }: TaskFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(schema),
  });

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit({ titre: data.titre, projectId });
    reset(); // reset form after submit so user can add another
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <input
            type="text"
            {...register('titre')}
            placeholder="Qu'y a-t-il à faire ?"
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all placeholder-gray-400"
            autoFocus
          />
          {errors.titre && <p className="mt-1 text-xs text-red-600">{errors.titre.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {isSubmitting ? 'Ajout...' : 'Ajouter'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
          >
            Fermer
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;