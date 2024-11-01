/* eslint-disable prettier/prettier */
import { TUSER } from "@/repositories/auth/user";
import { AxiosResponse } from "axios";

export type ApiReponse<T> = AxiosResponse<T>["data"];
export type AuthReponse = {
  access_token: string;
  user: TUSER;
};

export type ErrorType = {
  message: "";
};
export type OptionType = {
  key: string | any | number | boolean;
  value: string;
};
