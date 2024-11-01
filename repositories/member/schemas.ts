import * as Yup from "yup";
enum UserStatus {
  ACTIVE,
  INACTIVE,
  SUSPENDED,
}
export const memberSchema = Yup.object().shape({
  user_name: Yup.string().required("Username is required."),
  email: Yup.string()
    .email("Invalid email address.")
    .required("Email is required."),

  phone: Yup.string().required("Phone number is required"),

  password: Yup.string().required("Password is required."),

  full_name: Yup.string().required("Full name is required."),

  permission_ids: Yup.array().required("Permission ID is required."),

  status: Yup.string().required("Status is required"),

  role_id: Yup.number()
    .required("Role ID is required.")
    .typeError("Role ID must be a number."),
});
export type memberPayload = Yup.InferType<typeof memberSchema>;
