import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from './auth.middleware';
import { AuthRequest } from '../types';
import { config } from '../config';

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('authenticate middleware', () => {
  const next: NextFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 when no authorization header', () => {
    const req = { headers: {} } as AuthRequest;
    const res = mockResponse();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Authentication required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when header is not Bearer format', () => {
    const req = { headers: { authorization: 'Basic abc123' } } as AuthRequest;
    const res = mockResponse();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 for invalid token', () => {
    const req = { headers: { authorization: 'Bearer invalid-token' } } as AuthRequest;
    const res = mockResponse();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
  });

  it('should set req.user and call next for valid token', () => {
    const token = jwt.sign({ id: 1, email: 'test@example.com' }, config.jwtSecret);
    const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest;
    const res = mockResponse();

    authenticate(req, res, next);

    expect(req.user).toEqual({ id: 1, email: 'test@example.com' });
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 for expired token', () => {
    const token = jwt.sign({ id: 1, email: 'test@example.com' }, config.jwtSecret, {
      expiresIn: '0s' as any,
    });
    const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest;
    const res = mockResponse();

    // Small delay to ensure expiry
    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
