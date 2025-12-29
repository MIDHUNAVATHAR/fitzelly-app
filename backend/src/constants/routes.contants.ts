export const SYSTEM_ROUTES = {
    HEALTH: "/health"
} as const;

export const MODULE_ROUTES = {
    GYM_AUTH: "/gym-auth"
} as const;

export const GYM_AUTH_ROUTES = {
    SIGNUP_INIT: "/signup/initiate",
    SIGNUP_COMPLETE: "/signup/complete",
    LOGIN: "/login"
} as const;
