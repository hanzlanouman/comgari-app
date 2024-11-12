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

export type ClientType = "INDIVIDUAL" | "BUSINESS" | "RETAIL" | "WHOLESALE" | "VIP" | "CORPORATE" | "RESELLER" | "DISTRIBUTOR";

export const CLIENT_TYPES: ClientType[] = [
  "INDIVIDUAL",
  "BUSINESS",
  "RETAIL",
  "WHOLESALE",
  "VIP",
  "CORPORATE",
  "RESELLER",
  "DISTRIBUTOR"
];

export enum ClientStatus {
  Active = "Active",
  Inactive = "Inactive"
}
export const CLIENT_STATUS: ClientStatus[] = [
  ClientStatus.Active,
  ClientStatus.Inactive
];
