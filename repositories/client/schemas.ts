import * as Yup from "yup";
import { ClientType, CLIENT_TYPES, CLIENT_STATUS } from '@/common/types';


export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}



export const createClientSchema = Yup.object().shape({
  name: Yup.string().required("Client name is required."),
  description: Yup.string(),  // Optional
  logo: Yup.string().nullable(),
  type: Yup.string()
    .oneOf(CLIENT_TYPES, "Invalid client type")
    .optional(),
  status: Yup.string()
    .oneOf(CLIENT_STATUS, "Invalid client status")
    .required("Client status is required."),
  member_ids: Yup.array()
    .of(Yup.number())
    .required("Member IDs are required.")
    .min(1, "At least one member ID is required."),
});


export const briefSchema = Yup.object().shape({
  client_id: Yup.number()
    .required("Client ID is required.")
    .typeError("Client ID must be a number."),
  brief: Yup.string().required("Brief content is required."),
});

export const clientListingSchema = Yup.object().shape({
  start: Yup.number().required("Start index is required."),
  limit: Yup.number().required("Limit is required."),
});

export const clientMediaSchema = Yup.object().shape({
  files: Yup.array().of(
    Yup.object().shape({
      clientId: Yup.number().required("Client ID is required."),
      mimeType: Yup.string().required("MIME type is required."),
      url: Yup.string().required("URL is required."),
      ownerId: Yup.string().required("Owner ID is required."),
      ownerType: Yup.string().required("Owner type is required."),
    })
  ),
});

export const taskSchema = Yup.object().shape({
  title: Yup.string().required("Task title is required."),
  description: Yup.string().required("Task description is required."),
  dueDate: Yup.date().required("Due date is required."),
  priority: Yup.string()
    .oneOf(Object.values(TaskPriority))
    .required("Priority is required."),
  assignedTo: Yup.string().required("Assignee is required."),
  clientId: Yup.number()
    .required("Client ID is required.")
    .typeError("Client ID must be a number."),
});

export const createNoteSchema = Yup.object().shape({
  content: Yup.string().required("Note content is required."),
  projectId: Yup.number().required("Project ID is required."),
});

export const createProjectSchema = Yup.object().shape({
  name: Yup.string().required("Project name is required."),
  description: Yup.string().required("Project description is required."),
  clientId: Yup.number().required("Client ID is required."),
});

// Export types
export type CreateClientPayload = Yup.InferType<typeof createClientSchema>;
export type BriefPayload = Yup.InferType<typeof briefSchema>;
export type ClientListingPayload = Yup.InferType<typeof clientListingSchema>;
export type ClientMediaPayload = Yup.InferType<typeof clientMediaSchema>;
export type TaskPayload = Yup.InferType<typeof taskSchema>;
export type CreateNotePayload = Yup.InferType<typeof createNoteSchema>;
export type CreateProjectPayload = Yup.InferType<typeof createProjectSchema>;