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
      description: "User login"
    },
    REGISTER: {
      route: AuthUrl + "/signup",
      method: "POST",
      description: "User registration"
    },
    OTP: {
      route: AuthUrl + "/otp",
      method: "POST",
      description: "OTP verification"
    },
    FORGOT_PASSWORD: {
      route: AuthUrl + "/forgot-password",
      method: "POST",
      description: "Forgot password request"
    },
    RESET_PASSWORD: {
      route: AuthUrl + "/reset-password",
      method: "POST",
      description: "Reset password"
    },
    VERIFY_CRED: {
      route: AuthUrl + "/verify-cred",
      method: "PUT",
      description: "Verify credentials"
    },
    CHANGE_PASSWORD: {
      route: AuthUrl + "/change-password",
      method: "POST",
      description: "Change password"
    },
  },
  Member: {
    GET_ROLE: {
      route: UserUrl + "/roles",
      method: "GET",
      description: "Get user roles"
    },
    GET_PERMISSION: {
      route: UserUrl + "/all-permission",
      method: "GET",
      description: "Get all permissions"
    },
    CREATE_MEMBER: {
      route: UserUrl + "/member",
      method: "POST",
      description: "Create new member"
    },
    GET_MEMBER: {
      route: UserUrl + "/member",
      method: "GET",
      description: "Get member details"
    },
    GET_USER_PERMISSION: {
      route: UserUrl + "/permission",
      method: "GET",
      description: "Get user permissions"
    },
  },
  PAYMENT: {
    CREATE_BUYER: {
      route: PaymentUrl + "/create-buyer",
      method: "POST",
      description: "Create new buyer"
    },
    GET_CARD: {
      route: PaymentUrl + "/get-card",
      method: "GET",
      description: "Get card details"
    },
    GET_SUBSCRIPTION: {
      route: PaymentUrl + "/get-subscription",
      method: "GET",
      description: "Get subscription details"
    },
    CREATE_SUBSCRIPTION: {
      route: PaymentUrl + "/create-subscription",
      method: "POST",
      description: "Create new subscription"
    },
  },
  Client: {
    CREATE_CLIENT: {
      route: UserUrl + "/client",
      method: "POST",
      description: "Create a new client"
    },
    GET_CLIENTS: {
      route: UserUrl + "/client/clients",
      method: "POST",
      description: "Get all clients with pagination"
    },
    UPDATE_CLIENT: {
      route: UserUrl + "/client",
      method: "PUT",
      description: "Update client details"
    },
    DELETE_CLIENT: {
      route: UserUrl + "/client",
      method: "DELETE",
      description: "Delete a client"
    },
    GET_BRIEF: {
      route: UserUrl + "/client/brief",
      method: "GET",
      description: "Get client brief"
    },
    CREATE_BRIEF: {
      route: UserUrl + "/client/brief",
      method: "POST",
      description: "Create client brief"
    },
    UPDATE_BRIEF: {
      route: UserUrl + "/client/brief",
      method: "PUT",
      description: "Update client brief"
    },
    SAVE_MEDIA: {
      route: UserUrl + "/client/media",
      method: "POST",
      description: "Save client media"
    },
    CREATE_TASK: {
      route: UserUrl + "/client/task",
      method: "POST",
      description: "Create client task"
    },
    UPDATE_TASK: {
      route: UserUrl + "/client/task",
      method: "PUT",
      description: "Update client task"
    },
    DELETE_TASK: {
      route: UserUrl + "/client/task",
      method: "DELETE",
      description: "Delete client task"
    },
    GET_TASK: {
      route: UserUrl + "/client/task",
      method: "GET",
      description: "Get client tasks"
    },
    // New endpoints for Notes
    CREATE_NOTE: {
      route: UserUrl + "/client/note",
      method: "POST",
      description: "Create client note"
    },
    GET_NOTES: {
      route: UserUrl + "/client/note",
      method: "GET",
      description: "Get client notes"
    },
    UPDATE_NOTE: {
      route: UserUrl + "/client/note",
      method: "PUT",
      description: "Update client note"
    },
    DELETE_NOTE: {
      route: UserUrl + "/client/note",
      method: "DELETE",
      description: "Delete client note"
    },
    // Project endpoint
    CREATE_PROJECT: {
      route: UserUrl + "/client/project",
      method: "POST",
      description: "Create client project"
    }
  },
};