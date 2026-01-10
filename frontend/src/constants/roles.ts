export const ROLES = {
    GYM: 'gym',
    CLIENT: 'client',
    TRAINER: 'trainer',
    SUPER_ADMIN: 'super-admin'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
