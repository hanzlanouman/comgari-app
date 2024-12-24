import {TaskPayload} from "./types"

export const STATUS_OPTIONS = [
    { key: 'TO_DO', value: 'TO_DO' },
    { key: 'IN_PROGRESS', value: 'IN_PROGRESS' },
    { key: 'COMPLETED', value: 'COMPLETED' },
    { key: 'ON_HOLD', value: 'ON_HOLD' },
    { key: 'CANCELLED', value: 'CANCELLED' }
  ];

  export const PRIORITY_OPTIONS = [
    { key: 'high', value: 'high' },
    { key: 'medium', value: 'medium' },
    { key: 'low', value: 'low' }
  ];
  
export const INITIAL_FORM_VALUES: Omit<TaskPayload, 'projectId'> = {
    title: "",
    assignedTo: [],
    dueDate: new Date().toISOString(),
    priority: "medium",
    status: "TO_DO",
  };
  