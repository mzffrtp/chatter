import axios, { AxiosInstance } from "axios";

export const chatHttpApi: () => AxiosInstance = () => {
  const api = axios.create();

  api.defaults.baseURL = "http://127.0.0.1:5000";

  api.defaults.headers.common["Content-Type"] =
    "application/json; charset=utf-8";

  const token = localStorage.getItem("token");
  console.log("token-->", token);

  if (token) {
    api.defaults.headers.common["Authorization"] = "Bearer " + token;
  }

  return api;
};

export type ChatApiResponseType<T> =
  | {
      status: "error";
      errorMessage: string;
    }
  | {
      status: "success";
      data: T;
    };
