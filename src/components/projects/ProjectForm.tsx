import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateProjectRequest } from '../../types/Project';

const schema = z.object({
  nom: z.string().min(2, 'Nom du projet requis (minimum 2 caractères)'),
});

type ProjectFormData = z.infer<typeof schema>;

interface ProjectFormProps {
  onSubmit: (data: CreateProjectRequest) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

function ProjectForm({ onSubmit, isSubmitting = false, onCancel }: ProjectFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouveau projet</h3>
      
      <div className="mb-4">
        <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1.5">Nom du projet</label>
        <input
          id="nom"
          type="text"
          {...register('nom')}
          placeholder="Ex: Refonte du site web"
          className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all placeholder-gray-400"
          autoFocus
        />
        {errors.nom && <p className="mt-1 text-xs text-red-600">{errors.nom.message}</p>}
      </div>

      <div className="flex gap-3 justify-end mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Création...' : 'Créer le projet'}
        </button>
      </div>
    </form>
  );
}

export default ProjectForm;