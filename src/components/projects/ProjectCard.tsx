import type { Project } from "../../types/Project";
import { Link } from "react-router-dom";




interface projectCardProps {
    project: Project;
    onDelete: (id: string) => void;
}

function projectCard({ project, onDelete }: projectCardProps) {

    const handleDelete = () => {
        const confirmed = window.confirm(
            `Supprimer le projet "${project.name}" ?`,
        );
        if (confirmed) {
            onDelete(project.id);
        }
    };


    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {project.name}
                    </h3>

                    <p className="mt-2 text-sm text-gray-600">
                        {project.description || "Aucune description"}
                    </p>
                </div>
            </div>

            <div className="mt-5 flex gap-3">
                <Link
                    to={`/projects/${project.id}`}
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

export default projectCard;
