import { APP_NAMES } from "./enum";

export const environment = process.env.NODE_ENV;

const isDev = environment === "development";

const SERVER_HOST = isDev
  ? "http://192.168.1.2"
  : "https://api.comgari.com";

export const SERVER_URL = `${SERVER_HOST}`;

export type TAppConfig = {
  PORT?: number;
  PREFIX: string;
};

export const GoogleWebClientID = "225796584741-raqg0b198t68dfolltc0osfgejoenvkr.apps.googleusercontent.com";
export const GoogleIOSClientID = "225796584741-2c560fdrfim782p4hqek6s72rmj0kdsr.apps.googleusercontent.com";

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

const getAppConfig = (appName: APP_NAMES) => {
  return isDev ? AppDevConfigs[appName] : AppProdConfigs[appName];
};

const getUrl = (config: TAppConfig) => {
  return config.PORT ? `:${config.PORT}${config.PREFIX}` : config.PREFIX;
};

const AuthApp = getAppConfig(APP_NAMES.AUTH);
const UserApp = getAppConfig(APP_NAMES.USER);
const PaymentApp = getAppConfig(APP_NAMES.PAYMENT);

const AuthUrl = getUrl(AuthApp);
const UserUrl = getUrl(UserApp);
const PaymentUrl = getUrl(PaymentApp);

export const BaseUrl = `${SERVER_URL}`;

export { AuthUrl, UserUrl, PaymentUrl };
