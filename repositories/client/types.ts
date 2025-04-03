
export type TClient = {
  id: number;
  name: string;
  image?: string;
  category: string;
  status: string;
  description: string;
  progress: number;
  dueDate: string;
  members: Array<{
    id: number;
    image: string;
    name: string;
  }>;
};

export enum Action {
  ADD = 'Add',
  REMOVE = 'Remove',
}

interface Auth {
  id: number;
  email: string;
  username: string;
}

interface Member {
  id: number;
  Auth: Auth;
}


export enum TaskPriority {
  low = "low",
  medium = "medium",
  high = "high",
}
export enum TaskStatus {
  TO_DO = "TO_DO",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ON_HOLD = "ON_HOLD",
  CANCELLED = "CANCELLED",
}
export interface TaskMember {
  id: number;
  task_id: number;
  member_id: string;
  member: Member;
}

export interface Task {
  id: number;
  title: string;
  dueDate: string;
  priority: string;
  projectId: number;
  task_member: TaskMember[];
  status: string;
}

export interface TaskPayload {
  title: string;
  assignedTo: number[];
  dueDate: string;
  priority: string;
  projectId: number;
  status: string;
}

export interface MemberAction {
  member_id: number;
  action: "Add" | "Remove";
}

export interface UpdateTaskPayload extends Omit<TaskPayload, 'assignedTo'> {
  assingedTo: MemberAction[];
}

export type TSingedUrl = {
  name: string;
  signedUrl: string;
  fileUrl: string;
  updatedName: string
}

export type TPresignedUrlResponse = TSingedUrl[];