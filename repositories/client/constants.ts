import {TaskPayload} from "./types"

export const PRIORITY_OPTIONS = [
    { key: 'high', value: 'high' },
    { key: 'medium', value: 'medium' },
    { key: 'low', value: 'low' }
  ];
  
export const INITIAL_FORM_VALUES: Omit<TaskPayload, 'projectId'> = {
    title: "",
    description: "",
    assignedTo: [],
    dueDate: new Date().toISOString(),
    priority: "medium",
  };
  