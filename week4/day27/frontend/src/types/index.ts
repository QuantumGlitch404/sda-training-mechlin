export type TaskStatus =
  | "pending"
  | "in-progress"
  | "completed";

export type TaskPriority =
  | "low"
  | "medium"
  | "high";

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  tags: string[];
}