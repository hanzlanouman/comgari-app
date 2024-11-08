/* eslint-disable prettier/prettier */
import { AuthUrl, PaymentUrl, UserUrl } from "@/common/enviornment";
import { route } from "./routes";

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
    GET_USER_PERMISSION: {
      route: UserUrl + "/permission",
    },
  },
  PAYMENT: {
    CREATE_BUYER: {
      route: PaymentUrl + "/create-buyer",
    },
    GET_CARD: {
      route: PaymentUrl + "/get-card",
    },
    GET_SUBSCRIPTION: {
      route: PaymentUrl + "/get-subscription",
    },
    CREATE_SUBSCRIPTION: {
      route: PaymentUrl + "/create-subscription",
    },
  },
};
