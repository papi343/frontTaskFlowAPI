import { useForm } from "react-hook-form";
import { projectShema } from "../../shemas/project.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";




type projectFormData = z.infer<typeof projectShema>;

interface projectFormProps {
    onSubmit: (data: projectFormData) => void;
    isSubmitting?: boolean,
    initialValue?: projectFormData,
    submitLabel?: string,
};

function ProjectForm({ onSubmit, isSubmitting = false,
    initialValue, submitLabel = "cree le project" }: projectFormProps) {

    const { register,
        handleSubmit,
        formState: { errors },
    } = useForm<projectFormData>({
        resolver: zodResolver(projectShema),
        defaultValues: initialValue,
    })

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 rounded-xl border bg-white p-6 shadow-sm"
        >
            <div>
                <label
                    htmlFor="name"
                    className="mb-1 block text-sm font-medium text-gray-700"
                >
                    Nom du projet
                </label>

                <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className="w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2"
                />

                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
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
                    className="w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2"
                />

                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.description.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-gray-900 px-5 py-2.5 font-medium text-white disabled:opacity-50"
            >
                {isSubmitting ? "Enregistrement..." : submitLabel}
            </button>
        </form>
    );
}
export default ProjectForm;