


export type TaskStatus =
    | "TODO"
    | "IN_PROGRESS"
    | "DONE";

export type TaskPriority =
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "URGENT";

export interface Task {
    id: string;
    titre: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    projectId: string;
    assigneeId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskRequest {
    titre: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    projectId: string;
    assigneeId?: string;
}


export interface UpdateTaskRequest {
    titre?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assigneeId?: string;
}