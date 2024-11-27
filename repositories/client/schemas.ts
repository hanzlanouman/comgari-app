import * as Yup from "yup";
import {  CLIENT_TYPES, CLIENT_STATUS } from '@/common/types';
import {  Action } from '@/common/enum';
import { TaskPriority } from './types';


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

// ClientMediaDTO schema matches the backend's ClientMediaDTO
export const clientMediaSchema = Yup.object().shape({
  files: Yup.array().of(mediaSchema).required("Files are required"), // Matches @ValidateNested()
});

// CreateNoteDto schema matches the backend's CreateNoteDto
export const createNoteSchema = Yup.object().shape({
  notes: Yup.string().required("Notes are required"), // Matches IsString()
  project_id: Yup.number().required("Project ID is required"), // Matches IsNumber()
  client_note_media: Yup.array().of(mediaSchema).required("Client note media is required"), // Matches IsArray()
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
        prev_media_id: Yup.number()
          .optional()
          .nullable(), // Matches @IsOptional() and @IsNumber()
        new_url: Yup.string()
          .optional()
          .nullable(), // Matches @IsOptional() and @IsString()
        client_id: Yup.number().required('Client ID is required'), // Matches @IsNumber()
        owner_type: Yup.string().required('Owner type is required'), // Matches @IsString()
        mimeType: Yup.string()
          .optional()
          .nullable(), // Matches @IsOptional()
        owner_id: Yup.number().required('Owner ID is required'), // Matches @IsNumber()
        action: Yup.mixed()
          .oneOf(Object.values(Action), 'Invalid action type') // Matches @IsEnum(ActionType)
          .required('Action is required'),
      })
    )
    .required('Media array is required'), // Matches @IsArray()
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



export const taskSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  assignedTo: Yup.array()
    .of(Yup.number())
    .optional(),
  projectId: Yup.number().required("Project ID is required"),
  dueDate: Yup.date().required("Due date is required"),
  priority: Yup.string()
    .oneOf(Object.values(TaskPriority), "Invalid priority")
    .required("Priority is required"),
});

export const updateTaskSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
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
});
export type CreateClientPayload = Yup.InferType<typeof createClientSchema>;
export type UpdateClientPayload = Yup.InferType<typeof updateClientSchema>
export type UpdateClientMediaPayload = Yup.InferType<typeof updateClientMediaSchema>
export type BriefPayload = Yup.InferType<typeof briefSchema>;
export type ClientMediaPayload = Yup.InferType<typeof clientMediaSchema>;
export type TaskPayload = Yup.InferType<typeof taskSchema>;
export type UpdateTaskPayload = Yup.InferType<typeof updateTaskSchema>;
export type CreateNotePayload = Yup.InferType<typeof createNoteSchema>;
export type UpdateNotePayload = Yup.InferType<typeof updateNoteSchema>;
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

