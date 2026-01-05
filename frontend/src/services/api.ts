import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json"
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
interface FailedRequest {
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            // Don't retry if the failed request was login, refresh, or any public auth-init endpoint
            const isAuthRequest = originalRequest.url?.includes('/login') ||
                originalRequest.url?.includes('/refresh') ||
                originalRequest.url?.includes('/verify-otp') ||
                originalRequest.url?.includes('/forgot-password');

            if (isAuthRequest) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Use a fresh axios instance to avoid interceptor loops
                const { data } = await axios.post(`${API_BASE_URL}/gym-auth/refresh`, {}, {
                    withCredentials: true
                });

                if (data.status === 'success' && data.data.accessToken) {
                    const newToken = data.data.accessToken;
                    localStorage.setItem("accessToken", newToken);

                    api.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
                    originalRequest.headers['Authorization'] = 'Bearer ' + newToken;

                    processQueue(null, newToken);
                    return api(originalRequest);
                }
            } catch (err) {
                processQueue(err, null);
                // If refresh fails, clear everything and redirect
                localStorage.removeItem("accessToken");
                localStorage.removeItem("userRole");
                if (window.location.pathname !== '/') {
                    window.location.href = '/';
                }
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);
