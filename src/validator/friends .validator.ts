import { body, param } from 'express-validator'

/**
 * CREATE FRIEND
 */
export const createFriendValidator = [
  body('name')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Name is required'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email'),

  body('phone')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 7 })
    .withMessage('Invalid phone number')
]

/**
 * UPDATE FRIEND
 */
export const updateFriendValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid friend ID'),

  body('name')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email'),

  body('phone')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 7 })
    .withMessage('Invalid phone number')
]

/**
 * DELETE FRIEND
 */
export const deleteFriendValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid friend ID')
]
