import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "ngrok-skip-browser-warning": "true"
    }
})

// console.log("API Service Initialized with Base URL:", API_BASE_URL);

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// Queue handling variables are no longer needed since separate refresh endpoint is removed.

api.interceptors.response.use(
    (response) => {
        // Automatically scan for x-access-token header and update localStorage
        const newAccessToken = response.headers['x-access-token'];
        if (newAccessToken) {
            localStorage.setItem("accessToken", newAccessToken);
            api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
        }
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized
        // trigger logout only if it's NOT a login attempt
        // (because a failed login attempt also returns 401, but shouldn't redirect payload)
        const isLoginRequest = error.config?.url?.includes('/login');

        if (error.response && error.response.status === 401 && !isLoginRequest) {
            // Dispatch a custom event so AuthContext can pick it up and clear state
            window.dispatchEvent(new Event('auth-logout'));
        }
        return Promise.reject(error);
    }
);
