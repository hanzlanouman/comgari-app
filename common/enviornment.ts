/* eslint-disable prettier/prettier */
import { APP_NAMES } from "./enum";

export const environment = process.env.NODE_ENV;

const isDev = environment === "development";

const SERVER_HOST = isDev
  ? "http://192.168.1.5"
  : "https://comgari-api.devjunction.xyz";

export const SERVER_URL = `${SERVER_HOST}`;

export type TAppConfig = {
  PORT?: number;
  PREFIX: string;
};

export type TRoute =
  | string
  | {
      route: string;
      description: string;
    }
  | {
      prefix: string;
      postfix: string;
      description: string;
    };

export type TEndpoint = { [controller: string]: { [route: string]: TRoute } };

const AppDevConfigs: Record<APP_NAMES, TAppConfig> = {
  [APP_NAMES.USER]: {
    PORT: 3010,
    PREFIX: "/api/user",
  },
  [APP_NAMES.AUTH]: {
    PORT: 3011,
    PREFIX: "/api/auth",
  },
  [APP_NAMES.PAYMENT]: {
    PORT: 3012,
    PREFIX: "/api/payment",
  },
};

const AppProdConfigs: Record<APP_NAMES, TAppConfig> = {
  [APP_NAMES.USER]: {
    PREFIX: "/api/user",
  },
  [APP_NAMES.AUTH]: {
    PREFIX: "/api/auth",
  },
  [APP_NAMES.PAYMENT]: {
    PREFIX: "/api/payment",
  },
};

const AuthApp =
  environment === "development"
    ? AppDevConfigs[APP_NAMES.AUTH]
    : AppProdConfigs[APP_NAMES.AUTH];
const UserApp =
  environment === "development"
    ? AppDevConfigs[APP_NAMES.USER]
    : AppProdConfigs[APP_NAMES.USER];
const PaymentApp =
  environment === "development"
    ? AppDevConfigs[APP_NAMES.PAYMENT]
    : AppProdConfigs[APP_NAMES.PAYMENT];
const AuthUrl = AuthApp?.PORT
  ? `:${AuthApp?.PORT}${AuthApp.PREFIX}`
  : AuthApp.PREFIX;
const UserUrl = UserApp?.PORT
  ? `:${UserApp?.PORT}${UserApp.PREFIX}`
  : UserApp.PREFIX;
const PaymentUrl = PaymentApp?.PORT
  ? `:${PaymentApp?.PORT}${PaymentApp.PREFIX}`
  : PaymentApp.PREFIX;
export const BaseUrl = `${SERVER_URL}`;

export { AuthUrl, UserUrl, PaymentUrl };
