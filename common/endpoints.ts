/* eslint-disable prettier/prettier */
import { AuthUrl, PaymentUrl, UserUrl } from "@/common/enviornment";
import { route } from "./routes";

export type TRoute =
  | string
  | {
      route: string;
      description?: string;
      method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    }
  | {
      prefix: string;
      postfix: string;
      description?: string;
      method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    };

export type TEndpoint = { [controller: string]: { [route: string]: TRoute } };

export const END_POINTS = {
  AUTH: {
    LOGIN: {
      route: AuthUrl + "/login",
      method: "POST",
      description: "User login",
    },
    GOOGLE_LOGIN: {
      route: AuthUrl + "/o-auth/google",
      method: "POST",
      description: "Google login",
    },

    REGISTER: {
      route: AuthUrl + "/signup",
      method: "POST",
      description: "User registration",
    },
    NOTIFICATIONTOKEN: {
      route: AuthUrl + "/notification-token",
      method: "POST",
      description: "Notification Token",
    },
    OTP: {
      route: AuthUrl + "/otp",
      method: "POST",
      description: "OTP verification",
    },
    FORGOT_PASSWORD: {
      route: AuthUrl + "/forgot-password",
      method: "POST",
      description: "Forgot password request",
    },
    RESET_PASSWORD: {
      route: AuthUrl + "/reset-password",
      method: "POST",
      description: "Reset password",
    },
    VERIFY_CRED: {
      route: AuthUrl + "/verify-cred",
      method: "PUT",
      description: "Verify credentials",
    },
    CHANGE_PASSWORD: {
      route: AuthUrl + "/change-password",
      method: "PUT",
      description: "Change password",
    },
    CHECK_O_AUTH: {
      route: AuthUrl + "/check-oauth",
      method: "GET",
      description: "Check o-auth",
    },
    UPDATE_PROFILE: { route: AuthUrl + "/update-profile", method: "PUT" },
    UPDATE_PROFILE_PIC: {
      route: AuthUrl + "/update-profile-pic",
      method: "PUT",
    },
  },
  Member: {
    GET_ROLE: {
      route: UserUrl + "/roles",
      method: "GET",
      description: "Get user roles",
    },
    GET_PERMISSION: {
      route: UserUrl + "/all-permission",
      method: "GET",
      description: "Get all permissions",
    },
    CREATE_MEMBER: {
      route: UserUrl + "/member",
      method: "POST",
      description: "Create new member",
    },
    GET_MEMBER: {
      route: UserUrl + "/member",
      method: "GET",
      description: "Get member details",
    },
    DELETE_MEMBER: {
      route: UserUrl + "/member",
      method: "DELETE",
      description: "Delete member details",
    },
    UPDATE_MEMBER: {
      route: UserUrl + "/member",
      method: "PUT",
      description: "Update member details",
    },
    GET_USER_PERMISSION: {
      route: UserUrl + "/permission",
      method: "GET",
      description: "Get user permissions",
    },
  },
  PAYMENT: {
    CREATE_BUYER: {
      route: PaymentUrl + "/create-buyer",
      method: "POST",
      description: "Create new buyer",
    },
    GET_CARD: {
      route: PaymentUrl + "/get-card",
      method: "GET",
      description: "Get card details",
    },
    GET_SUBSCRIPTION: {
      route: PaymentUrl + "/get-subscription",
      method: "GET",
      description: "Get subscription details",
    },
    CREATE_SUBSCRIPTION: {
      route: PaymentUrl + "/create-subscription",
      method: "POST",
      description: "Create new subscription",
    },
  },
  Client: {
    CREATE_CLIENT: {
      route: UserUrl + "/client",
      method: "POST",
      description: "Create a new client",
    },
    GET_CLIENTS: {
      route: UserUrl + "/client/clients",
      method: "POST",
      description: "Get all clients with pagination",
    },
    GET_SINGLE_CLIENT: {
      route: UserUrl + "/client",
      method: "GET",
      description: "Get details of a single client by ID",
    },
    UPDATE_CLIENT: {
      route: UserUrl + "/client",
      method: "PUT",
      description: "Update client details",
    },
    DELETE_CLIENT: {
      route: UserUrl + "/client",
      method: "DELETE",
      description: "Delete a client",
    },
    GET_BRIEF: {
      route: UserUrl + "/client/brief",
      method: "GET",
      description: "Get client brief",
    },
    CREATE_BRIEF: {
      route: UserUrl + "/client/brief",
      method: "POST",
      description: "Create client brief",
    },
    UPDATE_BRIEF: {
      route: UserUrl + "/client/brief",
      method: "PUT",
      description: "Update client brief",
    },
    SAVE_MEDIA: {
      route: UserUrl + "/client/media",
      method: "POST",
      description: "Save client media",
    },
    CREATE_TASK: {
      route: UserUrl + "/client/task",
      method: "POST",
      description: "Create client task",
    },
    UPDATE_TASK: {
      route: UserUrl + "/client/task",
      method: "PUT",
      description: "Update client task",
    },
    DELETE_TASK: {
      route: UserUrl + "/client/task",
      method: "DELETE",
      description: "Delete client task",
    },
    GET_TASK: {
      route: UserUrl + "/client/task",
      method: "GET",
      description: "Get client tasks",
    },
    CREATE_NOTE: {
      route: UserUrl + "/client/note",
      method: "POST",
      description: "Create client note",
    },
    GET_NOTES: {
      route: UserUrl + "/client/note",
      method: "GET",
      description: "Get client notes",
    },
    UPDATE_NOTE: {
      route: UserUrl + "/client/note",
      method: "PUT",
      description: "Update client note",
    },
    DELETE_NOTE: {
      route: UserUrl + "/client/note",
      method: "DELETE",
      description: "Delete client note",
    },
    CREATE_PROJECT: {
      route: UserUrl + "/client/project",
      method: "POST",
      description: "Create client project",
    },
    UPLOAD: {
      route: UserUrl + "/upload",
    },
    GET_CLIENT_MEDIA: {
      route: UserUrl + "/client/Get-client-media",
    },
    UPDATE_CLIENT_MEDIA: { route: UserUrl + "/client/client-media" },
    CREATE_APPOINTMENT: {
      route: UserUrl + "/appointment",
    },
    GET_APPOINTMENT: {
      route: UserUrl + "/appointment",
    },
    UPDATE_APPOINTMENT: {
      route: UserUrl + "/appointment",
    },
    DELETE_APPOINTMENT: {
      route: UserUrl + "/appointment",
    },
    CREATE_PROPOSAL: {
      route: UserUrl + "/proposal",
    },
    GET_PROPOSAL: {
      route: UserUrl + "/proposal",
    },
    UPDATE_PROPOSAL: {
      route: UserUrl + "/proposal",
    },
    DELETE_PROPOSAL: {
      route: UserUrl + "/proposal",
    },
    UPDATE_CLIENT_MEDIA: { route: UserUrl + "/client/client-media" },
    CREATE_APPOINTMENT: {
      route: UserUrl + "/appointment",
    },
    GET_APPOINTMENT: {
      route: UserUrl + "/appointment",
    },
    UPDATE_APPOINTMENT: {
      route: UserUrl + "/appointment",
    },
    DELETE_APPOINTMENT: {
      route: UserUrl + "/appointment",
    },
    CREATE_PROPOSAL: {
      route: UserUrl + "/proposal",
    },
    GET_PROPOSAL: {
      route: UserUrl + "/proposal",
    },
    UPDATE_PROPOSAL: {
      route: UserUrl + "/proposal",
    },
    DELETE_PROPOSAL: {
      route: UserUrl + "/proposal",
    },
    CREATE_INVOICE: {
      route: UserUrl + "/invoice",
    },
    GET_INVOICES: {
      route: UserUrl + "/invoice",
    },
    UPDATE_INVOICE: {
      route: UserUrl + "/invoice",
    },
    DELETE_INVOICE: {
      route: UserUrl + "/invoice",
    },
  },
  Dashboard: {
    GET_DASHBOARD: {
      route: UserUrl + "/dashboard",
      method: "GET",
      description: "Create dashboard details",
    },
  },
};
