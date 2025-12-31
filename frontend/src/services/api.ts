import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Optional: Handle token expiration globally
            // localStorage.removeItem("accessToken");
            // localStorage.removeItem("userRole");
            // window.dispatchEvent(new Event('auth-change'));
        }
        return Promise.reject(error);
    }
);
