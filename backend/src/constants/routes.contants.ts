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
    VERIFY_TOKEN: "/auth/me"
} as const;




// USING IN APP.TS 
export const MODULE_ROUTES = {
    GYM_AUTH: "/gym-auth"
} as const;

