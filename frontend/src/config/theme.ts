/**
 * Centralized Theme Configuration
 * This file acts as the source of truth for design tokens.
 * It is imported by tailwind.config.js and can be used in JS/TS files.
 */

export const COLORS = {
    primary: {
        50: '#fffbf0',
        100: '#fff4c6',
        200: '#ffe888',
        300: '#ffd943',
        400: '#ffc60b',
        500: '#f59e0b', // Brand Gold
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
        950: '#451a03',
    },
    secondary: '#000000',
    surface: '#ffffff',
    accent: '#fafafa',

    // Semantic Colors
    success: '#10b981', // Emerald 500
    warning: '#f59e0b', // Amber 500
    error: '#ef4444',   // Red 500
    info: '#3b82f6',    // Blue 500
};

export const SHADOWS = {
    'tablet': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 4px rgba(0, 0, 0, 0.1)',
    'input': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    'glow-gold': '0 0 15px rgba(245, 158, 11, 0.3)',
};

export const ANIMATIONS = {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
};
