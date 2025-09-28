import axios from "axios";

export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({ baseURL: API_URL });

api.defaults.headers.common["Accept"] = "application/json;version=v1_web";
api.defaults.headers.common["Content-Type"] = "application/json";

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("auth.tokens");
  if (raw) {
    try {
      const { accessToken } = JSON.parse(raw);
      if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    } catch {}
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const s = err?.response?.status;
    if (s === 401 || s === 403) {
      localStorage.removeItem("auth.tokens");
    }
    return Promise.reject(err);
  }
);

export default api;
