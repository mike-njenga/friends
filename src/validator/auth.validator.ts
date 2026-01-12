import { body } from 'express-validator'

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