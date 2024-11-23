import * as Yup from "yup";
import {  CLIENT_TYPES, CLIENT_STATUS } from '@/common/types';
import {  Action } from '@/common/enum';

export enum TaskPriority {
  low = "low",
  medium = "medium",
  high = "high",
}



export const briefSchema = Yup.object().shape({
  client_id: Yup.number().required("Client ID is required"),
  brief: Yup.string().required("Brief is required"),
});

export const clientMediaSchema = Yup.object().shape({
  files: Yup.array().of(
    Yup.object().shape({
      url: Yup.string().required("URL is required"),
      mimeType: Yup.string().required("MIME type is required"),
      clientId: Yup.number().required("Client ID is required"),
      ownerId: Yup.number().required("Owner ID is required"),
      ownerType: Yup.string().required("Owner type is required"),
    })
  ),
});

export const taskSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  assignedTo: Yup.number().optional(),
  projectId: Yup.number().required("Project ID is required"),
  dueDate: Yup.date().required("Due date is required"),
  priority: Yup.string().oneOf(Object.values(TaskPriority)).required("Priority is required"),
});

export const createNoteSchema = Yup.object().shape({
  notes: Yup.string().required("Notes are required"),
  project_id: Yup.number().required("Project ID is required"),
});

export const createProjectSchema = Yup.object().shape({
  name: Yup.string().required("Project name is required"),
  location: Yup.string().required("Location is required"),
  metadata: Yup.mixed().optional(),
  description: Yup.string().required("Description is required"),
  client_id: Yup.number().required("Client ID is required"),
});

export const createClientSchema = Yup.object().shape({
  name: Yup.string().required("Client name is required."),
  description: Yup.string().optional(),
  logo: Yup.string().nullable().optional(),
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
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required."),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required."),
});

export const updateClientSchema = Yup.object().shape({
  id: Yup.string(),
  name: Yup.string(),
  description: Yup.string(),
  logo: Yup.string(),
  type: Yup.mixed().oneOf(Object.values(CLIENT_TYPES)),
  email: Yup.string().email('Email is invalid'),
  phone: Yup.string(),
  status: Yup.string().required('Status is required'),
  client_Staff: Yup.array().of(Yup.object().shape({
      staff_id: Yup.number(),
      action: Yup.mixed().oneOf(Object.values(Action))
    })
  )
})
export type CreateClientPayload = Yup.InferType<typeof createClientSchema>;
export type UpdateClientPayload = Yup.InferType<typeof updateClientSchema>

export type BriefPayload = Yup.InferType<typeof briefSchema>;
export type ClientMediaPayload = Yup.InferType<typeof clientMediaSchema>;
export type TaskPayload = Yup.InferType<typeof taskSchema>;
export type CreateNotePayload = Yup.InferType<typeof createNoteSchema>;
export type CreateProjectPayload = Yup.InferType<typeof createProjectSchema>;
export type ClientListingPayload = {
  start: number;
  limit: number;
};

export interface RequestUser {
  id: number;
  auth_id: string;
}

export interface Request {
  user: RequestUser;
}

