export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export type TaskFilter = "all" | "active" | "completed";
