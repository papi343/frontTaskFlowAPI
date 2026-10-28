export interface Project {
  id: number;
  nom: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  nom: string;
}

export interface UpdateProjectRequest {
  nom?: string;
}