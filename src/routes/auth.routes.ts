import express from 'express';
import { 
    signup,
    login, 
    logout, 
    changePassword, 
    requestPasswordReset, 
    refreshToken,
    getCurrentUser  
} from '../ controllers/auth.controller.js';
import { 
    signupValidator,
    loginValidator, 
    logoutValidator, 
    changePasswordValidator, 
    requestPasswordResetValidator, 
    refreshTokenValidator 
} from '../validator/auth.validator.js';
import { validate } from '../validator/validate.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Public endpoints
router.post('/signup', signupValidator, validate, signup);
router.post('/login', loginValidator, validate, login);
router.post('/refresh', refreshTokenValidator, validate, refreshToken);
router.post('/forgot-password', requestPasswordResetValidator, validate, requestPasswordReset);

// Protected endpoints - require authentication
router.use(authenticateUser);
router.get('/me', getCurrentUser);  // NEW - No validator needed for GET
router.post('/logout', logoutValidator, validate, logout);
router.put('/password', changePasswordValidator, validate, changePassword);

export default router;