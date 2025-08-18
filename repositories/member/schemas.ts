import * as Yup from "yup";

export enum UserStatus {
  ACTIVE,
  INACTIVE,
  SUSPENDED,
}

export const memberSchema = Yup.object().shape({
  user_name: Yup.string().required("Username is required."),
  email: Yup.string()
    .email("Invalid email address.")
    .required("Email is required."),
  phone: Yup.string()
    .matches(
      /^\+\d{1,4}\d+$/,
      "Phone number must start with a valid country code (e.g., +1 for US)"
    )
    .optional(),
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

export const updateMemberSchema = Yup.object().shape({
  full_name: Yup.string().required("Full name is required."),
  phone: Yup.string()
    .matches(
      /^\+\d{1,4}\d+$/,
      "Phone number must start with a valid country code (e.g., +1 for US)"
    )
    .optional(),
  status: Yup.mixed()
    .oneOf(Object.values(UserStatus), "Invalid status.")
    .optional(),
  role_id: Yup.number()
    .required("Role ID is required.")
    .typeError("Role ID must be a number."),
  permission_ids: Yup.array()
    .of(Yup.number().typeError("Permission ID must be a number."))
    .required("Permission IDs are required."),
});

export type MemberPayload = Yup.InferType<typeof memberSchema>;
export type UpdateMemberPayload = Yup.InferType<typeof updateMemberSchema>;
