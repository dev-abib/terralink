import api from "./api";
import { AxiosError } from "axios";
import { getItem, removeItem } from "./localStorage";

api.interceptors.request.use(config => {
  const token = getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;

