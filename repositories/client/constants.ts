import {TaskPayload} from "./types"

export const STATUS_OPTIONS = [
  { key: 'TO_DO', value: 'To Do' },
  { key: 'IN_PROGRESS', value: 'In Progress' },
  { key: 'COMPLETED', value: 'Completed' },
  { key: 'ON_HOLD', value: 'On Hold' },
  { key: 'CANCELLED', value: 'Cancelled' },
];


  export const PRIORITY_OPTIONS = [
    { key: 'high', value: 'High' },
    { key: 'medium', value: 'Medium' },
    { key: 'low', value: 'Low' }
  ];
  
export const INITIAL_FORM_VALUES: Omit<TaskPayload, 'projectId'> = {
    title: "",
    assignedTo: [],
    dueDate: new Date().toISOString(),
    priority: "medium",
    status: "TO_DO",
  };
  