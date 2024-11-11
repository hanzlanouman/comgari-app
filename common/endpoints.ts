/* eslint-disable prettier/prettier */
import { AuthUrl, UserUrl } from "@/common/enviornment";

export type TRoute =
  | string
  | {
      route: string;
      description: string;
      method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    }
  | {
      prefix: string;
      postfix: string;
      description: string;
      method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    };

export type TEndpoint = { [controller: string]: { [route: string]: TRoute } };
export const END_POINTS = {
  AUTH: {
    LOGIN: {
      route: AuthUrl + "/login",
      method: "POST",
    },
    REGISTER: {
      route: AuthUrl + "/signup",
      method: "POST",
    },
    OTP: {
      route: AuthUrl + "/otp",
      method: "POST",
    },
    FORGOT_PASSWORD: {
      route: AuthUrl + "/forgot-password",
      method: "POST",
    },
    RESET_PASSWORD: {
      route: AuthUrl + "/reset-password",
      method: "POST",
    },
    VERIFY_CRED: {
      route: AuthUrl + "/verify-cred",
      method: "PUT",
    },
    CHANGE_PASSWORD: {
      route: AuthUrl + "/change-password",
      method: "POST",
    },
  },
  Member: {
    GET_ROLE: {
      route: UserUrl + "/roles",
      method: "GET",
    },
    GET_PERMISSION: {
      route: UserUrl + "/all-permission",
      method: "GET",
    },
    CREATE_MEMBER: {
      route: UserUrl + "/member",
      method: "POST",
    },
    GET_MEMBER: {
      route: UserUrl + "/member",
      method: "GET",
    },
  },
  Client: {
    CREATE_CLIENT: {
      route: UserUrl + "/client",
      method: "POST",
      description: "Create a new client",
    },
    GET_CLIENTS: {
      route: UserUrl + "/client",
      method: "GET",
      description: "Get all clients",
    },
    UPDATE_CLIENT: {
      route: UserUrl + "/client/:id",
      method: "PUT",
      description: "Update client details",
    },
    DELETE_CLIENT: {
      route: UserUrl + "/client/:id",
      method: "DELETE",
      description: "Delete a client",
    },
    GET_BRIEF: {
      route: UserUrl + "/client/:id/brief",
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
      route: UserUrl + "/client/task/:id",
      method: "PUT",
      description: "Update client task",
    },
    DELETE_TASK: {
      route: UserUrl + "/client/task/:id",
      method: "DELETE",
      description: "Delete client task",
    },
    GET_TASK: {
      route: UserUrl + "/client/task/:id",
      method: "GET",
      description: "Get client tasks",
    },
  },
};