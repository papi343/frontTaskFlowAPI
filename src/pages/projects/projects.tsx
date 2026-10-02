import { useState } from "react";
import useProjects from "../../Hooks/useProjects";
import ProjectCard from "../../components/projects/ProjectCard";
import ProjectForm from "../../components/projects/ProjectForm";
import type { CreateProjectRequest } from "../../types/Project";
import DashboardLayout from "../../components/layout/DashboardLayout";





function Projects() {
    const [showForm, setShowForm] = useState(false);
    const [errorForm, setErrorForm] = useState("");
    const { projects, isLoading, error, createProject, deleteProject } = useProjects();


    const handleCreate = async (data: CreateProjectRequest) => {

        try {
            setErrorForm("");
            await createProject(data);
            setShowForm(false);
        } catch {
            setErrorForm("échec lors de la création");
        }

    };

    const handleDelete = async (id: string) => {
        try {
            setErrorForm("");
            await deleteProject(id);
        } catch {
            setErrorForm("échec lors de la suppression");
        }
    };
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Projects
                        </h2>

                        <p className="mt-1 text-gray-600">
                            Gérez vos projets TaskFlow.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowForm((prev) => !prev)}
                        className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white"
                    >
                        {showForm
                            ? "Annuler"
                            : "Nouveau projet"}
                    </button>
                </div>

                {showForm && (
                    <ProjectForm
                        onSubmit={handleCreate}
                        submitLabel="Créer le projet"
                    />
                )}

                {errorForm && (
                    <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {errorForm}
                    </p>
                )}

                {isLoading && (
                    <p className="text-gray-600">
                        Chargement des projets...
                    </p>
                )}

                {error && (
                    <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

                {!isLoading &&
                    !error &&
                    projects.length === 0 && (
                        <div className="rounded-xl border bg-white p-8 text-center">
                            <p className="text-gray-600">
                                Aucun projet pour le moment.
                            </p>
                        </div>
                    )}

                {!isLoading &&
                    projects.length > 0 && (
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
            </div>
        </DashboardLayout>
    );
}

export default Projects;




