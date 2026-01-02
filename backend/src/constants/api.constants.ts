import { SYSTEM_ROUTES, GYM_AUTH_ROUTES, MODULE_ROUTES } from "./routes.contants.js";

export const API_ROOT = {
    V1: "/api/v1"
} as const;

export const ENDPOINTS = {
    SYSTEM: SYSTEM_ROUTES,
    MODULES: MODULE_ROUTES,
}

export const ROUTER_ENDPOINTS = {
    GYM_AUTH: GYM_AUTH_ROUTES,
}