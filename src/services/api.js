import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("fos_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("fos_token");
      localStorage.removeItem("fos_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;

// --- Auth ---
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  me: () => api.get("/auth/me"),
};

// --- Records ---
export const recordsAPI = {
  getAll: (params) => api.get("/records", { params }),
  getById: (id) => api.get(`/records/${id}`),
  create: (data) => api.post("/records", data),
  update: (id, data) => api.put(`/records/${id}`, data),
  delete: (id) => api.delete(`/records/${id}`),
};

// --- Dashboard ---
export const dashboardAPI = {
  getSummary: () => api.get("/dashboard/summary"),
  getTrends: () => api.get("/dashboard/trends"),
  getByCategory: () => api.get("/dashboard/by-category"),
  getRecent: () => api.get("/dashboard/recent"),
};

// --- Users ---
export const usersAPI = {
  getAll: () => api.get("/users"),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  updateStatus: (id, status) => api.patch(`/users/${id}/status`, { status }),
  delete: (id) => api.delete(`/users/${id}`),
};
