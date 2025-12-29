import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    // console.log("🔥 INTERCEPTOR RUNNING");
    // console.log("TOKEN:", localStorage.getItem("token"));
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            //localStorage.removeItem("token");
            // window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
