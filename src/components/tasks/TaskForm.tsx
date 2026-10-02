import { z } from "zod";
import { taskSchema } from "../../shemas/task.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";



export type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
    onSubmit: (data: TaskFormData) => void;
    initialValues?: TaskFormData;
    submitLabel: string;
}

function TaskForm({ onSubmit, initialValues, submitLabel = "cree la tache" }: TaskFormProps) {

    const { register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: initialValues,
    });




    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 rounded-xl border bg-white p-6 shadow-sm"
        >
            <div>
                <label
                    htmlFor="titre"
                    className="mb-1 block text-sm font-medium text-gray-700"
                >
                    Titre
                </label>

                <input
                    id="titre"
                    type="text"
                    {...register("titre")}
                    className="w-full rounded-lg border px-4 py-2.5 outline-none"
                />

                {errors.titre && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.titre.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="description"
                    className="mb-1 block text-sm font-medium text-gray-700"
                >
                    Description
                </label>

                <textarea
                    id="description"
                    rows={4}
                    {...register("description")}
                    className="w-full rounded-lg border px-4 py-2.5 outline-none"
                />

                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.description.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="status"
                    className="mb-1 block text-sm font-medium text-gray-700"
                >
                    Statut
                </label>

                <select
                    id="status"
                    {...register("status")}
                    className="w-full rounded-lg border px-4 py-2.5 outline-none"
                >
                    <option value="TODO">À faire</option>
                    <option value="IN_PROGRESS">En cours</option>
                    <option value="DONE">Terminé</option>
                </select>
            </div>

            <div>
                <label
                    htmlFor="priority"
                    className="mb-1 block text-sm font-medium text-gray-700"
                >
                    Priorité
                </label>

                <select
                    id="priority"
                    {...register("priority")}
                    className="w-full rounded-lg border px-4 py-2.5 outline-none"
                >
                    <option value="LOW">Faible</option>
                    <option value="MEDIUM">Moyenne</option>
                    <option value="HIGH">Haute</option>
                    <option value="URGENT">Urgente</option>
                </select>
            </div>

            <div>
                <label
                    htmlFor="assigneeId"
                    className="mb-1 block text-sm font-medium text-gray-700"
                >
                    ID utilisateur assigné
                </label>

                <input
                    id="assigneeId"
                    type="text"
                    {...register("assigneeId")}
                    className="w-full rounded-lg border px-4 py-2.5 outline-none"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-gray-900 px-5 py-2.5 font-medium text-white disabled:opacity-50"
            >
                {isSubmitting
                    ? "Enregistrement..."
                    : submitLabel}
            </button>
        </form>
    );
}

export default TaskForm;