import { Request, Response, NextFunction } from 'express';

type ValidationRule = {
  field: string;
  required?: boolean;
  type?: string;
  minLength?: number;
  maxLength?: number;
  isEmail?: boolean;
  isArray?: boolean;
  arrayItemType?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validate = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = req.body[rule.field];

      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${rule.field} is required`);
        continue;
      }

      if (value === undefined || value === null) continue;

      if (rule.type && typeof value !== rule.type) {
        errors.push(`${rule.field} must be a ${rule.type}`);
        continue;
      }

      if (rule.isArray && !Array.isArray(value)) {
        errors.push(`${rule.field} must be an array`);
        continue;
      }

      if (rule.isArray && Array.isArray(value) && rule.arrayItemType) {
        if (!value.every((item: unknown) => typeof item === rule.arrayItemType)) {
          errors.push(`${rule.field} must be an array of ${rule.arrayItemType}s`);
          continue;
        }
      }

      if (rule.isEmail && typeof value === 'string' && !emailRegex.test(value)) {
        errors.push(`${rule.field} must be a valid email`);
      }

      if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
        errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
      }

      if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
        errors.push(`${rule.field} must be at most ${rule.maxLength} characters`);
      }
    }

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    next();
  };
};

export const validateRegister = validate([
  { field: 'email', required: true, type: 'string', isEmail: true },
  { field: 'password', required: true, type: 'string', minLength: 6, maxLength: 128 },
]);

export const validateLogin = validate([
  { field: 'email', required: true, type: 'string', isEmail: true },
  { field: 'password', required: true, type: 'string' },
]);
