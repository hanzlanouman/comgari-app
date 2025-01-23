/* eslint-disable prettier/prettier */ 
/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
import { BaseUrl } from "@/common";
import { store, logout, setLoading, stopLoading } from "@/store";
import { Token } from "@stripe/stripe-react-native";

const axiosApi = axios.create();

// Function to get headers with authorization token
const getHeader = (headers: AxiosHeaders) => {
  const token = store.getState().auth.token;
  const newheaders: Partial<AxiosHeaders> = {};

  if (token && !headers["Authorization"]) {
    newheaders["Authorization"] = `Bearer ${token}`;
  }

  if (!Object.prototype.hasOwnProperty.call(headers, "Content-Type")) {
    newheaders["Content-Type"] = "application/json";
  }

  return newheaders;
};

// Request interceptor to handle adding token and loading state
axiosApi.interceptors.request.use(
  (config: any) => {
    const headers = getHeader(config.headers);
    let showLoader = false;

    if (Object.prototype.hasOwnProperty.call(config, "show_loader")) {
      showLoader = config.show_loader;
    }

    if (!config.url.includes("http")) {
      config.url = `${BaseUrl}${config.url}`;
    }

    if (headers) {
      const newHeaders = { ...config.headers, ...headers };
      const newConfig = { ...config, headers: newHeaders };

      if (showLoader) {
        store.dispatch(setLoading(config.url));
      }

      return newConfig;
    }

    if (showLoader) {
      store.dispatch(setLoading(config.url));
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptors to handle loading state and errors
const responseSuccess = (response: any) => {
  store.dispatch(stopLoading(response.config.url));
  return response;
};

const responseError = (error: any) => {
  store.dispatch(stopLoading(error.config.url));

  if (
    error?.response?.data?.statusCode === 401 &&
    error?.response?.data?.message === "Unauthorized"
  ) {
    store.dispatch(logout());
  }

  return Promise.reject(error);
};

axiosApi.interceptors.response.use(
  (response) => responseSuccess(response),
  (error) => responseError(error)
);

// GET request
export async function get(url: string, config = {}) {
  return await axiosApi
    .get(url, { ...config })
    .then((response) => response.data);
}

// POST request (general)
export async function post(url: string, data: any, config = {}) {
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then((response) => response.data);
}

// PUT request
export async function put(url: string, data: any, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then((response) => response.data);
}

// DELETE request
export async function del(url: string, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then((response) => response.data);
}

// POST request for FormData (file uploads)
export async function postForm(
  url: string,
  data: FormData,
  config: AxiosRequestConfig = {}
) {
  const formDataConfig = {
    ...config,
    headers: {
      ...config.headers,
      "Content-Type": "multipart/form-data",
    },
  };
  return axiosApi
    .post(url, data, formDataConfig)
    .then((response) => response.data);
}

export default axiosApi;
