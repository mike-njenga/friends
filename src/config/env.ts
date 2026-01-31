import dotenv from 'dotenv';
dotenv.config();

const myconfig = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL,

    // Supabase configurations
    supabase: {
        url: process.env.SUPABASE_URL,
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        anonKey: process.env.SUPABASE_ANNON_KEY, 
    },

    cookies: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'lax' as const, // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        accessTokenName: 'access_token',
        refreshTokenName: 'refresh_token',
    },

}; 

export default myconfig;