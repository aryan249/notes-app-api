import { validate } from './validate.middleware';
import { Request, Response, NextFunction } from 'express';

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body: Record<string, unknown>) => ({ body } as Request);

describe('validate middleware', () => {
  const next: NextFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call next when validation passes', () => {
    const middleware = validate([
      { field: 'name', required: true, type: 'string' },
    ]);
    const req = mockRequest({ name: 'test' });
    const res = mockResponse();

    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return 400 for missing required field', () => {
    const middleware = validate([
      { field: 'name', required: true, type: 'string' },
    ]);
    const req = mockRequest({});
    const res = mockResponse();

    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ['name is required'],
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 for wrong type', () => {
    const middleware = validate([
      { field: 'age', type: 'number' },
    ]);
    const req = mockRequest({ age: 'not a number' });
    const res = mockResponse();

    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ['age must be a number'],
    });
  });

  it('should validate email format', () => {
    const middleware = validate([
      { field: 'email', required: true, type: 'string', isEmail: true },
    ]);
    const req = mockRequest({ email: 'not-an-email' });
    const res = mockResponse();

    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ['email must be a valid email'],
    });
  });

  it('should validate minLength', () => {
    const middleware = validate([
      { field: 'password', required: true, type: 'string', minLength: 6 },
    ]);
    const req = mockRequest({ password: 'abc' });
    const res = mockResponse();

    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ['password must be at least 6 characters'],
    });
  });

  it('should validate maxLength', () => {
    const middleware = validate([
      { field: 'title', type: 'string', maxLength: 5 },
    ]);
    const req = mockRequest({ title: 'way too long' });
    const res = mockResponse();

    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should validate array type', () => {
    const middleware = validate([
      { field: 'tags', isArray: true, arrayItemType: 'string' },
    ]);
    const req = mockRequest({ tags: 'not-array' });
    const res = mockResponse();

    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ['tags must be an array'],
    });
  });

  it('should validate array item types', () => {
    const middleware = validate([
      { field: 'tags', isArray: true, arrayItemType: 'string' },
    ]);
    const req = mockRequest({ tags: ['valid', 123] });
    const res = mockResponse();

    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ['tags must be an array of strings'],
    });
  });

  it('should skip optional fields when absent', () => {
    const middleware = validate([
      { field: 'name', type: 'string' },
    ]);
    const req = mockRequest({});
    const res = mockResponse();

    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should collect multiple errors', () => {
    const middleware = validate([
      { field: 'email', required: true, type: 'string' },
      { field: 'password', required: true, type: 'string' },
    ]);
    const req = mockRequest({});
    const res = mockResponse();

    middleware(req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      errors: ['email is required', 'password is required'],
    });
  });
});
