import * as Yup from "yup";
import { CLIENT_TYPES, CLIENT_STATUS } from "@/common/types";
import { Action } from "@/common/enum";
import { TaskPriority, TaskStatus } from "./types";
import { InvoiceStatus } from "@/app/(root)/(tabs)/clients/[id]/invoices/add-invoice";

export const briefSchema = Yup.object().shape({
  client_id: Yup.number().required("Client ID is required"),
  brief: Yup.string().required("Brief is required"),
});

// MediaDTO schema matches the backend's MediaDTO
export const mediaSchema = Yup.object().shape({
  url: Yup.string().required("URL is required"), // Matches IsString()
  mimeType: Yup.string().required("MIME type is required"), // Matches IsString()
  clientId: Yup.number().required("Client ID is required"), // Matches IsNumber()
  ownerId: Yup.number().required("Owner ID is required"), // Matches IsNumber()
  ownerType: Yup.string().required("Owner type is required"), // Matches IsString()
});

export const notemediaSchema = Yup.object().shape({
  url: Yup.string().required("URL is required"), // Matches IsString()
  mimeType: Yup.string().required("MIME type is required"), // Matches IsString()
  clientId: Yup.number().required("Client ID is required"), // Matches IsNumber()
});

// ClientMediaDTO schema matches the backend's ClientMediaDTO
export const clientMediaSchema = Yup.object().shape({
  files: Yup.array().of(mediaSchema).required("Files are required"), // Matches @ValidateNested()
});

export const getClientMediaSchema = Yup.object().shape({
  client_id: Yup.number().required("Client ID is required"), // Matches IsNumber()
  owner_id: Yup.number().required("Owner ID is required"), // Matches IsNumber()
  owner_type: Yup.string().required("Owner type is required"), // Matches IsString()
});

// CreateNoteDto schema matches the backend's CreateNoteDto
export const createNoteSchema = Yup.object().shape({
  notes: Yup.string().required("Notes are required"), // Matches IsString()
  project_id: Yup.number().required("Project ID is required"), // Matches IsNumber()
  client_note_media: Yup.array()
    .of(notemediaSchema)
    .required("Client note media is required"), // Matches IsArray()
});

export const createProjectSchema = Yup.object().shape({
  name: Yup.string().required("Project name is required"),
  location: Yup.string().required("Location is required"),
  metadata: Yup.mixed().optional(),
  description: Yup.string().required("Description is required"),
  client_id: Yup.number().required("Client ID is required"),
});
// CreateNoteDto schema matches the backend's CreateNoteDto
export const updateNoteSchema = Yup.object().shape({
  notes: Yup.string().required("Notes are required"), // Matches IsString()
  project_id: Yup.number().required("Project ID is required"), // Matches IsNumber()
});
export const updateClientMediaSchema = Yup.object().shape({
  media: Yup.array()
    .of(
      Yup.object().shape({
        prev_media_id: Yup.number().optional().nullable(),
        new_url: Yup.string().optional().nullable(),
        client_id: Yup.number().required("Client ID is required"),
        owner_type: Yup.string().required("Owner type is required"),
        mimeType: Yup.string().optional().nullable(),
        owner_id: Yup.number().required("Owner ID is required"),
        action: Yup.mixed()
          .oneOf(Object.values(Action), "Invalid action type")
          .required("Action is required"),
      })
    )
    .required("Media array is required"),
});

export const createClientSchema = Yup.object().shape({
  name: Yup.string().required("Client name is required."),
  description: Yup.string().optional(),
  logo: Yup.string().nullable().optional(),
  type: Yup.string().oneOf(CLIENT_TYPES, "Invalid client type").optional(),
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
    .matches(
      /^\+\d{1,4}\d+$/,
      "Phone number must start with a valid country code (e.g., +1 for US)"
    )
    .required("Phone number is required"),
    address: Yup.string().required("Address is required"),
});

export const updateClientSchema = Yup.object().shape({
  id: Yup.string(),
  name: Yup.string(),
  description: Yup.string(),
  logo: Yup.string(),
  type: Yup.mixed().oneOf(Object.values(CLIENT_TYPES)),
  email: Yup.string().email("Email is invalid"),
  phone: Yup.string()
    .matches(
      /^\+\d{1,4}\d+$/,
      "Phone number must start with a valid country code (e.g., +1 for US)"
    )
    .required("Phone number is required"),
  status: Yup.string().required("Status is required"),
  client_Staff: Yup.array().of(
    Yup.object().shape({
      staff_id: Yup.number(),
      action: Yup.mixed().oneOf(Object.values(Action)),
    })
  ),
});

export const taskSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  assignedTo: Yup.array().of(Yup.number()).optional(),
  projectId: Yup.number().required("Project ID is required"),
  dueDate: Yup.date().required("Due date is required"),
  priority: Yup.string()
    .oneOf(Object.values(TaskPriority), "Invalid priority")
    .required("Priority is required"),
  status: Yup.string()
    .oneOf(Object.values(TaskStatus), "Invalid priority")
    .required("Priority is required"),
});



export const updateTaskSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  assingedTo: Yup.array()
    .of(
      Yup.object().shape({
        member_id: Yup.number().required("Member ID is required"),
        action: Yup.string()
          .oneOf(Object.values(Action))
          .required("Action is required"),
      })
    )
    .optional(),
  projectId: Yup.number().required("Project ID is required"),
  dueDate: Yup.date().required("Due date is required"),
  priority: Yup.string()
    .oneOf(Object.values(TaskPriority), "Invalid priority")
    .required("Priority is required"),
  status: Yup.string()
    .oneOf(Object.values(TaskStatus), "Invalid priority")
    .required("Priority is required"),
});

export const createAppointmentSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  clientId: Yup.number()
    .integer("Client ID must be an integer")
    .required("Client ID is required"),
  memberId: Yup.array().required("Member ID is required."),
  date: Yup.string().required("Date is required"),
  startTime: Yup.string().required("Start Time is required"),
  endTime: Yup.string().required("End Time is required"),
  notes: Yup.string().required("Notes are required"),
  projectId: Yup.number()
    .integer("Project ID must be an integer")
    .required("Project ID is required"),
});
export const updateAppointmentSchema = Yup.object().shape({
  title: Yup.string().optional(),
  clientId: Yup.number().integer("Client ID must be an integer").optional(),
  date: Yup.string().optional(),
  startTime: Yup.string().optional(),
  endTime: Yup.string().optional(),
  notes: Yup.string().optional(),
  projectId: Yup.number().integer("Project ID must be an integer").optional(),
  appointment_member: Yup.array()
    .of(
      Yup.object().shape({
        staff_id: Yup.number()
          .integer("Staff ID must be an integer")
          .optional(),
        action: Yup.mixed<Action>().oneOf(Object.values(Action)).optional(),
      })
    )
    .optional(),
});
export const createProposalSchema = Yup.object().shape({
  client_id: Yup.number()
    .integer("Client ID must be an integer")
    .required("Client ID is required"),
  date: Yup.date().required("Date is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  zip_code: Yup.number()
    .integer("Zip Code must be an integer")
    .required("Zip Code is required"),
  job_name: Yup.string().required("Job Name is required"),
  job_phone: Yup.string()
    .matches(
      /^\+[1-9]\d{1,14}$/,
      "Phone number must include country code (e.g., +1 for US)"
    )
    .required("Job Phone is required"),
  specification: Yup.string().required("Specification is required"),
  project_director: Yup.string().required("Project Director is required"),
  estimated_days: Yup.number()
    .integer("Estimated Days must be an integer")
    .required("Estimated Days is required"),
  estimated_cost: Yup.string()
    .matches(
      /^\d+(\.\d{1,2})?$/,
      "Estimated cost must be a valid decimal number (e.g., 100.00)"
    )
    .required("Estimated cost is required"),
  project_id: Yup.number()
    .integer("Project ID must be an integer")
    .required("Project ID is required"),
});

export const createInvoiceSchema = Yup.object().shape({
  client_id: Yup.number()
    .integer("Client ID must be an integer")
    .required("Client ID is required"),
  date: Yup.date().required("Date is required"),
  job_name: Yup.string().required("Job Name is required"),
  total_amount: Yup.string()
    .matches(
      /^\d+(\.\d{1,2})?$/,
      "Total amount must be a valid decimal number (e.g., 100.00)"
    )
    .required("Total amount is required"),
  status: Yup.string()
    .oneOf(Object.values(InvoiceStatus), "Invalid status")
    .required("Status is required"),
  project_id: Yup.number()
    .integer("Project ID must be an integer")
    .required("Project ID is required"),
});

export const PresignedUrlPayload = Yup.array().of(
  Yup.object().shape({
    name: Yup.string().required("name is required"),
    extension: Yup.string().required("extension is required"),
  })
);

export type TPresignedUrlPayload = Yup.InferType<typeof PresignedUrlPayload>;
export type CreateInvoicePayload = Yup.InferType<typeof createInvoiceSchema>;
export type CreateProposalPayload = Yup.InferType<typeof createProposalSchema>;
export type CreateClientPayload = Yup.InferType<typeof createClientSchema>;
export type UpdateClientPayload = Yup.InferType<typeof updateClientSchema>;
export type UpdateClientMediaPayload = Yup.InferType<
  typeof updateClientMediaSchema
>;
export type BriefPayload = Yup.InferType<typeof briefSchema>;
export type ClientMediaPayload = Yup.InferType<typeof clientMediaSchema>;
export type GetClientMediaPayload = Yup.InferType<typeof getClientMediaSchema>;
export type TaskPayload = Yup.InferType<typeof taskSchema>;
export type UpdateTaskPayload = Yup.InferType<typeof updateTaskSchema>;
export type CreateNotePayload = Yup.InferType<typeof createNoteSchema>;
export type UpdateNotePayload = Yup.InferType<typeof updateNoteSchema>;
export type CreateProjectPayload = Yup.InferType<typeof createProjectSchema>;
export type CreateAppointmentPayload = Yup.InferType<
  typeof createAppointmentSchema
>;
export type UpdateAppointmentPayload = Yup.InferType<
  typeof updateAppointmentSchema
>;

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
