import { Request, Response, NextFunction } from 'express';
import { AppError, errorHandler, notFoundHandler } from './error.middleware';

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('errorHandler', () => {
  const next: NextFunction = jest.fn();

  it('should handle AppError with correct status code', () => {
    const err = new AppError(422, 'Validation failed');
    const res = mockResponse();

    errorHandler(err, {} as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({ error: 'Validation failed' });
  });

  it('should handle generic errors as 500', () => {
    const err = new Error('Something broke');
    const res = mockResponse();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    errorHandler(err, {} as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });

    consoleSpy.mockRestore();
  });
});

describe('notFoundHandler', () => {
  it('should return 404 with route not found message', () => {
    const res = mockResponse();

    notFoundHandler({} as Request, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Route not found' });
  });
});

describe('AppError', () => {
  it('should be an instance of Error', () => {
    const err = new AppError(400, 'Bad request');
    expect(err).toBeInstanceOf(Error);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Bad request');
    expect(err.name).toBe('AppError');
  });
});
