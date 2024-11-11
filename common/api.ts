/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any*/

import axios, { AxiosHeaders } from "axios";

import { BaseUrl } from "@/common";

import { store, logout, setLoading, stopLoading } from "@/store";

const axiosApi = axios.create();

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
    Promise.reject(error);
  }
);

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

export async function get(url: string, config = {}) {
  return await axiosApi
    .get(url, { ...config })
    .then((response) => response.data);
}

export async function post(url: string, data: any, config = {}) {
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then((response) => response.data);
}

export async function put(url: string, data: any, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then((response) => response.data);
}

export async function del(url: string, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then((response) => response.data);
}



export default axiosApi;
