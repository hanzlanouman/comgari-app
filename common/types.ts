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

export type ClientType = "Construction" | "Building" | "LandMark" ;

export const CLIENT_TYPES: ClientType[] = [
  "Construction",
  "Building",
  "LandMark",
];

export enum ClientStatus {
  Active = "Active",
  Inactive = "Inactive"
}
export const CLIENT_STATUS: ClientStatus[] = [
  ClientStatus.Active,
  ClientStatus.Inactive
];
