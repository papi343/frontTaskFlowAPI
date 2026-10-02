import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import TaskForm from "../../components/tasks/TaskForm";

import {
    getTask,
    updateTask,
} from "../../Api/tasks.api";

import type { Task } from "../../types/task";

function TaskDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadTask = async () => {
            if (!id) {
                setError("Tâche introuvable.");
                setIsLoading(false);
                return;
            }

            try {
                const data = await getTask(id);
                setTask(data);
            } catch {
                setError(
                    "Impossible de charger la tâche.",
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadTask();
    }, [id]);

    const handleUpdate = async (data: {
        titre: string;
        description?: string;
        status:
        | "TODO"
        | "IN_PROGRESS"
        | "DONE";
        priority:
        | "LOW"
        | "MEDIUM"
        | "HIGH"
        | "URGENT";
        assigneeId?: string;
    }) => {
        if (!id) {
            return;
        }

        try {
            setError("");

            const updatedTask = await updateTask(id, data);

            setTask(updatedTask);
        } catch {
            setError(
                "Impossible de modifier la tâche.",
            );
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <p className="text-gray-600">
                    Chargement de la tâche...
                </p>
            </DashboardLayout>
        );
    }

    if (error || !task) {
        return (
            <DashboardLayout>
                <div className="space-y-4">
                    <p className="text-red-600">
                        {error || "Tâche introuvable."}
                    </p>

                    <Link
                        to="/tasks"
                        className="inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                    >
                        Retour aux tâches
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <button
                    type="button"
                    onClick={() => navigate("/tasks")}
                    className="text-sm text-gray-600 hover:text-gray-900"
                >
                    ← Retour aux tâches
                </button>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {task.titre}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Projet : {task.projectId}
                    </p>
                </div>

                {error && (
                    <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

                <TaskForm
                    initialValues={{
                        titre: task.titre,
                        description: task.description ?? "",
                        status: task.status,
                        priority: task.priority,
                        assigneeId: task.assigneeId ?? "",
                    }}
                    onSubmit={handleUpdate}
                    submitLabel="Enregistrer les modifications"
                />
            </div>
        </DashboardLayout>
    );
}

export default TaskDetails;