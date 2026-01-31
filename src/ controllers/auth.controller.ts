import type { Request, Response } from "express"
import { supabaseAdmin, supabaseClient } from "../config/supabase.js"
import type { CreateUserProfileInput } from "../types/models.types.js"
import config from "../config/env.js";
import type { CookieOptions } from 'express';

// Helper: Reusable cookie options
const getCookieOptions = (): CookieOptions => ({
    httpOnly: config.cookies.httpOnly,
    secure: config.cookies.secure,
    sameSite: config.cookies.sameSite, //as 'strict' | 'lax' | 'none',
    maxAge: config.cookies.maxAge,
    path: '/',
});


// Public user registration/signup
export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password, username, phone } = req.body;


        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                },
                emailRedirectTo: `${config.frontendUrl}/verify-email`,
            },
        });
        if (authError || !authData.user) {

            return res.status(400).json({
                status: 'error',
                message: 'Failed to create account',
                details: authError?.message || 'Unknown error'
            });
        }

        res.status(201).json({
            status: 'success',
            message: 'Account created successfully. Please check your email to verify your account.',
            user: {
                id: authData.user.id,
                email: authData.user.email,
                username,
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};




// Admin creates user - no auto-login
export const createUser = async (req: Request, res: Response) => {
    try {
        const { email, password, username, role, phone, is_active } = req.body;

        // Create user in Supabase Auth with role in app_metadata
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                username,
            },
            app_metadata: {
                role: role,
            },
        });

        if (authError || !authData.user) {
            return res.status(400).json({
                status: 'error',
                message: 'Failed to create user',
                details: authError?.message || 'Unknown error'
            });
        }

        // Create user profile

        const userProfile: CreateUserProfileInput = {
            id: authData.user.id,
            email: authData.user.email || email,
            username,
            role,
            phone: phone || null,
            is_active: is_active !== undefined ? is_active : true,
        };

        const { error: profileError } = await supabaseAdmin
            .from('user_profiles')
            .insert(userProfile);

        if (profileError) {
            // Rollback: delete the auth user if profile creation fails
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
            return res.status(400).json({
                status: 'error',
                message: 'Failed to create user profile',
                details: profileError.message
            });
        }

        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            user: {
                id: authData.user.id,
                email: authData.user.email,
                username,
                role,
                phone: phone || null,
                is_active: userProfile.is_active,
            }
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};



export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        // console.log(req.body);

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
        });



        if (error || !data.session || !data.user) {

            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password',
                details: error?.message || 'Authentication failed'
            });
        }

        const { data: profile, error: profileError } = await supabaseAdmin
            .from('user_profiles')
            .select('id, email, username, role, phone, is_active')
            .eq('id', data.user.id)
            .single();



        if (profileError || !profile) {
            return res.status(404).json({
                status: 'error',
                message: 'User profile not found'
            });
        }

        if (!profile.is_active) {
            return res.status(403).json({
                status: 'error',
                message: 'Account is inactive. Please contact administrator.'
            });
        }

        const cookieOptions = getCookieOptions();

        res.cookie(config.cookies.accessTokenName, data.session.access_token, cookieOptions);
        res.cookie(config.cookies.refreshTokenName, data.session.refresh_token, cookieOptions);

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            user: {
                id: profile.id,
                email: profile.email,
                username: profile.username,
                role: profile.role,
                phone: profile.phone,
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};


//refresh token
export const refreshToken = async (req: Request, res: Response) => {
    try {
        const refresh_token = req.cookies?.[config.cookies.refreshTokenName];

        if (!refresh_token) {
            return res.status(401).json({
                status: 'error',
                message: 'Refresh token not found'
            });
        }

        const { data, error } = await supabaseClient.auth.refreshSession({
            refresh_token,
        });

        if (error || !data.session) {
            res.clearCookie(config.cookies.accessTokenName, { path: '/' });
            res.clearCookie(config.cookies.refreshTokenName, { path: '/' });

            return res.status(401).json({
                status: 'error',
                message: 'Invalid or expired refresh token',
                details: error?.message || 'Token refresh failed'
            });
        }

        if (!data.user) {
            return res.status(401).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const { data: profile } = await supabaseAdmin
            .from('user_profiles')
            .select('id, is_active')
            .eq('id', data.user.id)
            .single();

        if (!profile || !profile.is_active) {
            res.clearCookie(config.cookies.accessTokenName, { path: '/' });
            res.clearCookie(config.cookies.refreshTokenName, { path: '/' });

            return res.status(403).json({
                status: 'error',
                message: 'Account is inactive. Please contact administrator.'
            });
        }

        const cookieOptions = getCookieOptions();

        res.cookie(config.cookies.accessTokenName, data.session.access_token, cookieOptions);
        res.cookie(config.cookies.refreshTokenName, data.session.refresh_token, cookieOptions);

        res.status(200).json({
            status: 'success',
            message: 'Token refreshed successfully'
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { current_password, new_password } = req.body;

        if (!userId) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized'
            });
        }

        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);
        if (!authUser?.user?.email) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const { error: verifyError } = await supabaseClient.auth.signInWithPassword({
            email: authUser.user.email,
            password: current_password,
        });

        if (verifyError) {
            return res.status(401).json({
                status: 'error',
                message: 'Current password is incorrect'
            });
        }

        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
            password: new_password,
        });

        if (updateError) {
            return res.status(400).json({
                status: 'error',
                message: 'Failed to update password',
                details: updateError.message
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const adminResetPassword = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const { new_password } = req.body;

        const { error } = await supabaseAdmin.auth.admin.updateUserById(id, {
            password: new_password,
        });

        if (error) {
            return res.status(400).json({
                status: 'error',
                message: 'Failed to reset password',
                details: error.message
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Admin reset password error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: `${config.frontendUrl}/reset-password`,
        });

        // Log error for debugging but don't expose to user
        if (error) {
            console.error('Password reset email error:', error);
        }

        // Always return success for security (prevents email enumeration)
        res.status(200).json({
            status: 'success',
            message: 'If an account with that email exists, a password reset link has been sent.'
        });
    } catch (error) {
        console.error('Request password reset error:', error);
        res.status(200).json({
            status: 'success',
            message: 'If an account with that email exists, a password reset link has been sent.'
        });
    }
};


// Get current authenticated user
export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized'
            });
        }

        // Get user profile with all necessary data
        const { data: profile, error } = await supabaseAdmin
            .from('user_profiles')
            .select('id, email, username, role, phone, is_active, created_at')
            .eq('id', userId)
            .single();

        if (error || !profile) {
            return res.status(404).json({
                status: 'error',
                message: 'User profile not found'
            });
        }

        if (!profile.is_active) {
            return res.status(403).json({
                status: 'error',
                message: 'Account is inactive'
            });
        }

        res.status(200).json({
            status: 'success',
            user: {
                id: profile.id,
                email: profile.email,
                username: profile.username,
                role: profile.role,
                phone: profile.phone,
                created_at: profile.created_at,
            }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const cookieOptions = getCookieOptions();

        res.clearCookie(config.cookies.accessTokenName, cookieOptions);
        res.clearCookie(config.cookies.refreshTokenName, cookieOptions);

        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};