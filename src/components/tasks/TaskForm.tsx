import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateTaskRequest } from '../../types/task';

const schema = z.object({
  titre: z.string().min(2, 'Le titre de la tâche doit contenir au moins 2 caractères'),
});

type TaskFormData = z.infer<typeof schema>;

interface TaskFormProps {
  projectId: number;
  onSubmit: (data: CreateTaskRequest) => Promise<unknown> | void;
  isSubmitting?: boolean;
  onCancel?: () => void;
  placeholder?: string;
}

function TaskForm({ projectId, onSubmit, isSubmitting = false, onCancel, placeholder }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(schema),
  });

  const handleFormSubmit = async (data: TaskFormData) => {
    await onSubmit({ titre: data.titre, projectId });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="flex-1 relative">
          <input
            type="text"
            {...register('titre')}
            placeholder={placeholder || "Nouvelle tâche... (Appuyez sur Entrée pour valider)"}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-2 justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 active:scale-[0.99] disabled:opacity-60 transition-all shadow-xs flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>{isSubmitting ? 'Ajout...' : 'Ajouter la tâche'}</span>
          </button>
        </div>
      </div>
      {errors.titre && (
        <p className="mt-1.5 text-xs text-rose-600 font-medium pl-1">{errors.titre.message}</p>
      )}
    </form>
  );
}

export default TaskForm;