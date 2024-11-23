
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
  export interface TaskMember {
    id: number;
    task_id: number;
    member_id: string;
    member: Member;
  }
  
  export interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    priority: string;
    projectId: number;
    task_member: TaskMember[];
  }
  
  export interface TaskPayload {
    title: string;
    description: string;
    assignedTo: number[];
    dueDate: string;
    priority: string;
    projectId: number;
  }
  
  export interface MemberAction {
    member_id: number;
    action: "Add" | "Remove";
  }
  
  export interface UpdateTaskPayload extends Omit<TaskPayload, 'assignedTo'> {
    assingedTo: MemberAction[];
  }