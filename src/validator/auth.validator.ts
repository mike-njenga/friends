import { body } from 'express-validator'



// Add to your auth.validator.ts
export const signupValidator = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),

  body('password')
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('confirmPassword')
    .isString()
    .isLength({ min: 8 })
    .withMessage('Confirm Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Confirm Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('username')
    .isString()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),

  body('phone')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 10, max: 13 })
    .matches(/^(07|01|\+254)[0-9]{8}$/)
    .withMessage('Invalid phone number')
];

/**
 * LOGIN
 */
export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),

  body('password')
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
]

/**
 * LOGOUT
 */
export const logoutValidator = [
  body('refreshToken')
    .optional()
    .isString()
    .withMessage('Refresh token must be a string')
]

/**
 * CHANGE PASSWORD (authenticated)
 */
export const changePasswordValidator = [
  body('currentPassword')
    .isString()
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .isString()
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
]

/**
 * REQUEST PASSWORD RESET
 */
export const requestPasswordResetValidator = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
]

/**
 * RESET PASSWORD
 */
export const resetPasswordValidator = [
  body('token')
    .isString()
    .notEmpty()
    .withMessage('Reset token is required'),

  body('newPassword')
    .isString()
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
]

/**
 * REFRESH TOKEN
 */
export const refreshTokenValidator = [
  body('refreshToken')
    .isString()
    .notEmpty()
    .withMessage('Refresh token is required')
]



//loginValidator
//logoutValidator
//changePasswordValidator
//requestPasswordResetValidator
//resetPasswordValidator
//resetPasswordValidator
//refreshTokenValidator