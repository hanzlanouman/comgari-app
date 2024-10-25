/* eslint-disable prettier/prettier */
import { TUSER } from "../auth/user";

export type TLoginResponse = {
  access_token: string;
  user: TUSER;
};
export type TReponse = {
  success: boolean;
  data?: any;
  message?: any;
};
