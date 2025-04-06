import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";


const { logout } = useAuthStore.getState();

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized, redirecting to login...");
      // Optional: Clear token or logout logic
      logout();
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
