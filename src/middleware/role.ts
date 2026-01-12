import type { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase.js';

const authorizeRole = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({ 
                    status: 'error', 
                    message: 'Unauthorized: User not authenticated' 
                });
            }

            // Fetch user role from user_profiles table
            const { data: profile, error } = await supabaseAdmin
                .from('profiles')
                .select('role')
                .eq('id', req.user.id)
                .single();

            if (error || !profile) {
                return res.status(403).json({ 
                    status: 'error', 
                    message: 'Forbidden: User profile not found' 
                });
            }

            // Check if user's role is in the allowed roles list
            if (!roles.includes(profile.role)) {
                return res.status(403).json({ 
                    status: 'error', 
                    message: 'Forbidden: You are not authorized to access this resource' 
                });
            }

            // Attach role to request for use in controllers if needed
            (req as any).userRole = profile.role;
            next();
        } catch (error) {
            console.error('Role authorization error:', error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Internal server error during authorization' 
            });
        }
    };
};

export default authorizeRole;