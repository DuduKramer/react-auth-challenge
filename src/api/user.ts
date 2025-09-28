import api from "./client";
export const getProfile = () => api.get("/auth/profile/").then(r => r.data);
