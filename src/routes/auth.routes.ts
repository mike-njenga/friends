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
import {validate} from "../validator/validate.js"

const router = express.Router();

// Public endpoints
router.post('/login', loginValidator, login, validate);
router.post('/refresh', refreshTokenValidator, refreshToken, validate);
router.post('/forgot-password', requestPasswordResetValidator, requestPasswordReset, validate);
router.post('/reset-password', resetPasswordValidator, resetPassword, validate);

// Protected endpoints - require authentication
router.use(authenticateUser, validate);
router.post('/logout',logoutValidator, logout, validate);
router.put('/password', changePasswordValidator, changePassword, validate);

export default router


