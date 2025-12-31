/* ===============================
      HEALTH CHECK
================================*/

export const SYSTEM_ROUTES = {
    HEALTH: "/health"
} as const;


/* ===============================
           GYM AUTH
================================*/

export const GYM_AUTH_ROUTES = {
    SIGNUP_INIT: "/signup/initiate",
    SIGNUP_COMPLETE: "/signup/complete",
    LOGIN: "/login",
    LOGOUT: "/logout",
    VERIFY_TOKEN: "/auth/me",
    FORGOT_PASSWORD_INIT: "/forgot-password/initiate",
    RESET_PASSWORD: "/forgot-password/reset"
} as const;




// USING IN APP.TS 
export const MODULE_ROUTES = {
    GYM_AUTH: "/gym-auth",
    CLIENT_AUTH: "/client-auth",
    TRAINER_AUTH: "/trainer-auth"
} as const;

