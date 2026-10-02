import { useSearchParams } from "react-router-dom";
import type { CreateTaskRequest } from "../../types/task";
import { useState } from "react";
import useTasks from "../../Hooks/useTasks";
import TaskForm from "../../components/tasks/TaskForm";
import DashboardLayout from "../../components/layout/DashboardLayout";
import TaskCard from "../../components/tasks/TaskCard";






function Tasks() {
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get('projectId');

    const {
        tasks,
        isLoading,
        error,
        createTask,
        deleteTask,
    } = useTasks(projectId ?? '');

    const [showForm, setShowForm] = useState(false);
    const [formError, setFormError] = useState("");

    const handleCreate = async (data: Omit<CreateTaskRequest, "projectId">) => {
        if (!projectId) {
            setFormError("Aucun projet n'a été sélectionné.");

            return;
        }
        setFormError("");

        try {
            await createTask({ projectId, ...data })
        }
        catch (error) {
            if (error instanceof Error) {
                setFormError(error.message);
            } else {
                setFormError("une erreur s'est produite");
            }
        }
    }



    const handleDelete = async (id: string) => {
        try {
            await deleteTask(id);
        }
        catch (error) {
            if (error instanceof Error) {
                setFormError(error.message);
            } else {
                setFormError("une erreur s'est produite");
            }
        }
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Tasks
                        </h2>

                        <p className="mt-1 text-gray-600">
                            Gérez les tâches de votre projet.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setShowForm((prev) => !prev)
                        }
                        className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white"
                    >
                        {showForm
                            ? "Annuler"
                            : "Nouvelle tâche"}
                    </button>
                </div>

                {showForm && projectId && (
                    <TaskForm
                        onSubmit={handleCreate}
                        submitLabel="Créer la tâche"
                    />
                )}

                {formError && (
                    <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {formError}
                    </p>
                )}

                {isLoading && (
                    <p className="text-gray-600">
                        Chargement des tâches...
                    </p>
                )}

                {error && (
                    <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

                {!isLoading &&
                    !error &&
                    tasks.length === 0 && (
                        <div className="rounded-xl border bg-white p-8 text-center">
                            <p className="text-gray-600">
                                Aucune tâche pour le moment.
                            </p>
                        </div>
                    )}

                {!isLoading &&
                    tasks.length > 0 && (
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
            </div>
        </DashboardLayout>
    );
}

export default Tasks;