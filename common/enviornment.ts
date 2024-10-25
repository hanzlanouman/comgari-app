/* eslint-disable prettier/prettier */
import { APP_NAMES } from "./enum";

const environment = "development";

const SERVER_HOST = "http://192.168.1.6";

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
};

const AppProdConfigs: Record<APP_NAMES, TAppConfig> = {
  [APP_NAMES.USER]: {
    PORT: 3010,
    PREFIX: "/api/user",
  },
  [APP_NAMES.AUTH]: {
    PORT: 3011,
    PREFIX: "/api/auth",
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

const AuthUrl = AuthApp?.PORT
  ? `:${AuthApp?.PORT}${AuthApp.PREFIX}`
  : AuthApp.PREFIX;
const UserUrl = UserApp?.PORT
  ? `:${UserApp?.PORT}${UserApp.PREFIX}`
  : UserApp.PREFIX;

export const BaseUrl = `${SERVER_URL}`;

export { AuthUrl, UserUrl };
