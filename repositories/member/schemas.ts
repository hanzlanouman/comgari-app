import { Action } from '@/common/enum';
import * as Yup from "yup";

enum UserStatus {
  ACTIVE,
  INACTIVE,
  SUSPENDED,
}

// Schema for creating a new member
export const memberSchema = Yup.object().shape({
  user_name: Yup.string().required("Username is required."),
  email: Yup.string()
    .email("Invalid email address.")
    .required("Email is required."),
  phone: Yup.string().optional(),
  password: Yup.string().required("Password is required."),
  full_name: Yup.string().required("Full name is required."),
  permission_ids: Yup.array()
    .of(Yup.number().typeError("Permission ID must be a number."))
    .required("Permission IDs are required."),
  status: Yup.mixed()
    .oneOf(Object.values(UserStatus), "Invalid status.")
    .required("Status is required."),
  role_id: Yup.number()
    .required("Role ID is required.")
    .typeError("Role ID must be a number."),
});

// Schema for updating an existing member
export const updateMemberSchema = Yup.object().shape({
  user_name: Yup.string().optional(),
  phone: Yup.string().optional(),
  full_name: Yup.string().optional(),
  status: Yup.mixed()
    .oneOf(Object.values(UserStatus), "Invalid status.")
    .optional(),
  role: Yup.array()
    .of(
      Yup.object().shape({
        role_id: Yup.number().typeError("Role ID must be a number."),
        action: Yup.mixed()
          .oneOf(Object.values(Action), "Invalid action.")
          .optional(),
      })
    )
    .optional(),
  permission: Yup.array()
    .of(
      Yup.object().shape({
        permission_id: Yup.number().typeError("Permission ID must be a number."),
        action: Yup.mixed()
          .oneOf(Object.values(Action), "Invalid action.")
          .optional(),
      })
    )
    .optional(),
});

export type MemberPayload = Yup.InferType<typeof memberSchema>;
export type UpdateMemberPayload = Yup.InferType<typeof updateMemberSchema>;
