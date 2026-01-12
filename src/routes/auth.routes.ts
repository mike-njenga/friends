import express from 'express';
import { login, logout, changePassword, requestPasswordReset, resetPassword, refreshToken } from '../ controllers/auth.controller.js';
import { 
    loginValidator, 
    logoutValidator, 
    changePasswordValidator, 
    requestPasswordResetValidator, 
    resetPasswordValidator, 
    refreshTokenValidator } from '../validator/auth.validator.js'
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Public endpoints
router.post('/login', loginValidator, login);
router.post('/refresh', refreshTokenValidator, refreshToken);
router.post('/forgot-password', requestPasswordResetValidator, requestPasswordReset);
router.post('/reset-password', resetPasswordValidator, resetPassword);

// Protected endpoints - require authentication
router.use(authenticateUser);
router.post('/logout',logoutValidator, logout);
router.put('/password', changePasswordValidator, changePassword);

export default router


