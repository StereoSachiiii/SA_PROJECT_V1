export const APP_CONFIG = {
    API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_KEY || 'pk_test_51T2S87FVluswMdjunBn1GRh1MlSSLUTzQ3ww5JtMB1BAK7HdWW0yF74o47pu13Gbb5dterWz4Egw46M4Kf5bOQbO00sjYLBHsp',
    DEMO_EVENT_ID: 5001,
    APP_NAME: 'StereoSachiiii',
};

export const ROLES = {
    ADMIN: 'ADMIN',
    VENDOR: 'VENDOR',
    EMPLOYEE: 'EMPLOYEE',
} as const;
