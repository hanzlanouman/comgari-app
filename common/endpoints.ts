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
      mothod: "POST",
    },
    REGISTER: {
      route: AuthUrl + "/signup",
      mothod: "POST",
    },
    OTP: {
      route: AuthUrl + "/otp",
      mothod: "POST",
    },

    FORGOT_PASSWORD: {
      route: AuthUrl + "/forgot-password",
      mothod: "POST",
    },
    RESET_PASSWORD: {
      route: AuthUrl + "/reset-password",
      mothod: "POST",
    },
    VERFY_CRED: {
      route: AuthUrl + "/verify-cred",
      mothod: "PUT",
    },
    CHANGE_PASSWORD: {
      route: AuthUrl + "/change-password",
      mothod: "POST",
    },
  },
  Member: {
    GET_ROLE: {
      route: UserUrl + "/roles",
    },
    GET_PERMISSION: {
      route: UserUrl + "/all-permission",
    },
    CREATE_MEMBER: {
      route: UserUrl + "/member",
    },
    GET_MEMBER: {
      route: UserUrl + "/member",
    },
  },
};
