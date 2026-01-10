/* ===============================
      HEALTH CHECK
================================*/

export const SYSTEM_ROUTES = {
    HEALTH: "/health"
} as const;


/* ===============================
           GYM AUTH
================================*/
export const MODULE_ROUTES = {
    GYM_AUTH: "/gym-auth",
    GYM_PLAN: "/gym-plan",
    GYM_TRAINER: "/gym-trainer",
    GYM_CLIENT: "/gym-client",
    GYM_MEMBERSHIP: "/gym-membership",
    GYM_EQUIPMENT: "/gym-equipment",
    CLIENT_AUTH: "/client-auth",
    TRAINER_AUTH: "/trainer-auth",
    SUPER_ADMIN_AUTH: "/super-admin-auth",
    SUPER_ADMIN_GYM_LISTING: "/super-admin/gyms",
    TRAINER_PLAN: "/trainer-plan",
    TRAINER_CLIENTS: "/trainer-clients",
    CLIENT_PLAN: "/client-plan",
    CLIENT_PROFILE: "/client-profile",
    TRAINER_PROFILE: "/trainer-profile"
} as const;





//in routers...........

export const GYM_AUTH_ROUTES = {
    SIGNUP_INIT: "/signup/initiate",
    SIGNUP_COMPLETE: "/signup/complete",
    LOGIN: "/login",
    LOGOUT: "/logout",
    VERIFY_TOKEN: "/auth/me",
    FORGOT_PASSWORD_INIT: "/forgot-password/initiate",
    RESET_PASSWORD: "/forgot-password/reset",
    GOOGLE_AUTH_INIT: "/auth/google",
    GOOGLE_AUTH_CALLBACK: "/auth/google/callback",
    REFRESH: "/refresh"
} as const;





