import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateProjectRequest } from '../../types/Project';

const schema = z.object({
  nom: z.string().min(2, 'Le nom du projet doit contenir au moins 2 caractères'),
});

type ProjectFormData = z.infer<typeof schema>;

interface ProjectFormProps {
  onSubmit: (data: CreateProjectRequest) => Promise<void> | void;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

function ProjectForm({ onSubmit, isSubmitting = false, onCancel }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xl space-y-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Nouveau projet</h3>
          <p className="text-xs text-slate-500 mt-0.5">Donnez un titre clair à votre espace de travail.</p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <div>
        <label htmlFor="nom" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          Titre du projet
        </label>
        <input
          id="nom"
          type="text"
          autoFocus
          {...register('nom')}
          placeholder="Ex: Refonte Dashboard Client, Sprint Marketing Q4..."
          className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 outline-none transition-all placeholder:text-slate-400 ${
            errors.nom
              ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10'
              : 'border-slate-200 focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10'
          }`}
        />
        {errors.nom && (
          <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.nom.message}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 active:scale-[0.99] disabled:opacity-60 transition-all shadow-xs flex items-center gap-2"
        >
          {isSubmitting ? 'Création en cours...' : 'Créer le projet'}
        </button>
      </div>
    </form>
  );
}

export default ProjectForm;