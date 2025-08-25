import axios from "axios";
import type {
  CreateOrderRequest,
  Order,
  Pagination,
  Product,
  User,
} from "../types";

const API_BASE_URL =
  import.meta.env.REACT_APP_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productAPI = {
  getAll: (params?: { page?: number; limit?: number; ids?: string }) =>
    api.get<{ products: Product[]; pagination: Pagination }>("/products", {
      params,
    }),

  getById: (id: string) => api.get<Product>(`/products/${id}`),

  create: (data: FormData) => {
    return api.post("/products", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  update: (id: string, data: FormData) => {
    return api.put(`/products/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  delete: (id: string) => api.delete(`/products/${id}`),
};

export const orderAPI = {
  create: (order: CreateOrderRequest) =>
    api.post<{ order: Order }>("/orders", order),

  getAll: (params?: { page?: number; limit?: number }) =>
    api.get<{ orders: Order[]; pagination: Pagination }>("/orders", { params }),

  getById: (id: string) => api.get<Order>(`/orders/${id}`),

  updateStatus: (id: string, status: string) =>
    api.put(`/orders/${id}/status`, { status }),
};

export const authAPI = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: User }>("/auth/login", { email, password }),
};

export default api;
