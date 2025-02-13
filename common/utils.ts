/* eslint-disable prettier/prettier */
import { AxiosError } from "axios";

export const getErrorMessage = (error: AxiosError | any): string => {
  if (
    error?.response &&
    error?.response?.data &&
    error?.response?.data?.message
  ) {
    return error.response.data.message;
  }

  return error?.message || "Unknown error";
};

export const getCustomErrorMessage = (error: AxiosError | any): string => {
  if (
    error?.response &&
    error?.response?.data &&
    error?.response?.data?.message
  ) {
    return error.response.data.message;
  }

  return error?.message || "Unknown error";
};
