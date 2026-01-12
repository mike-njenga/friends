import { type Request,type Response,type NextFunction } from 'express'
import { validationResult } from 'express-validator'

export function validate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req)

 if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed',
      errors: errors.array().map(err => {
        return {
          field: err.type === 'field' ? err.path : 'general',
          message: err.msg
        };
      })
    });
  }

  next()
}

