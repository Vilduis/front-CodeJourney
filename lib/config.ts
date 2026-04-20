/**
 * Configuración centralizada de la aplicación
 * Lee las variables de entorno y proporciona valores por defecto
 */

const config = {
    /**
     * URL base de la API del backend
     * Se lee desde .env (NEXT_PUBLIC_API_URL)
     * Valor por defecto: http://localhost:5000
     */
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',

    /**
     * Endpoints de la API
     */
    api: {
        users: '/api/users',
        posts: '/api/posts',
        comments: '/api/comments',
    },
} as const;

/**
 * Construye la URL completa para un endpoint de la API
 * @param endpoint - Endpoint de la API (e.g., '/api/users')
 * @returns URL completa
 */
export const getApiUrl = (endpoint: string): string => {
    return `${config.apiUrl}${endpoint}`;
};

export default config;
