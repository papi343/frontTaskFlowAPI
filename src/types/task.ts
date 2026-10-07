export interface Task {
  id: number;
  titre: string;
  complete: boolean;
  projectId: number;
}

export interface CreateTaskRequest {
  titre: string;
  projectId: number;
}

export interface UpdateTaskRequest {
  complete: boolean;
}