import type { Task } from "../../types/task";
import { Link } from "react-router-dom";







interface TaskCardProps {
    task: Task;
    onDelete: (id: string) => void;
}

function TaskCard({ task, onDelete }: TaskCardProps) {
    const handleDelete = () => {
        const confirmed = window.confirm(`etes vous sur de vouloir supprimer la tache ${task.titre}`);

        if (confirmed) {
            onDelete(task.id);
        }

    };
    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
                {task.titre}
            </h3>

            <p className="mt-2 text-sm text-gray-600">
                {task.description || "Aucune description"}
            </p>

            <div className="mt-3 text-sm text-gray-500">
                <p>Statut : {task.status}</p>
                <p>Priorité : {task.priority}</p>
            </div>

            <div className="mt-5 flex gap-3">
                <Link
                    to={`/tasks/${task.id}`}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                >
                    Voir
                </Link>

                <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-lg border px-4 py-2 text-sm font-medium text-red-600"
                >
                    Supprimer
                </button>
            </div>
        </div>
    );
}

export default TaskCard;

