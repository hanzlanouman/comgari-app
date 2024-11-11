//repositories\client\schemas.ts
import * as Yup from "yup";

export enum ClientType {
  INDIVIDUAL = "INDIVIDUAL",
  COMPANY = "COMPANY",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export const createClientSchema = Yup.object().shape({
  name: Yup.string().required("Client name is required."),
  description: Yup.string().required("Description is required."),
  logo: Yup.string().nullable(),
  type: Yup.string()
    .oneOf(Object.values(ClientType))
    .required("Client type is required."),
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

export type CreateClientPayload = Yup.InferType<typeof createClientSchema>;
export type BriefPayload = Yup.InferType<typeof briefSchema>;
export type ClientMediaPayload = Yup.InferType<typeof clientMediaSchema>;
export type TaskPayload = Yup.InferType<typeof taskSchema>;