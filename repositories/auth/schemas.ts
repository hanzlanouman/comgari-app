/* eslint-disable prettier/prettier */

import * as yup from "yup";

const SignupSchema = yup.object({
  user_name: yup.string().required("User name is required"),
  full_name: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  business_name: yup.string().required("Business name is required"),
  phone: yup.string().required("Contact number is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export type SignupPayload = yup.InferType<typeof SignupSchema>;
export { SignupSchema };
const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid Email Address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});
export type LoginPayload = yup.InferType<typeof LoginSchema>;
export { LoginSchema };

const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid Email Address")
    .required("Email is required"),
});
export type forgotPasswordPayload = yup.InferType<typeof forgotPasswordSchema>;
export { forgotPasswordSchema };

const OtpSchema = yup.object().shape({
  otp: yup
    .array()
    .of(yup.string().required("Required").matches(/^\d$/, "Must be a digit"))
    .length(4, "OTP must be 4 digits"),
});
export type OtpPayload = yup.InferType<typeof OtpSchema>;
export { OtpSchema };

const ResetPassowrdSchema = yup.object().shape({
  email: yup.string().required("Email is required"),
  otp: yup.string().required("Otp is required"),
  password: yup.string().required("Password is required"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});
export type ResetPasswordPayload = yup.InferType<typeof ResetPassowrdSchema>;
export { ResetPassowrdSchema };
