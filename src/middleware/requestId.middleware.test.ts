import { Request, Response, NextFunction } from 'express';
import { requestId } from './requestId.middleware';

describe('requestId middleware', () => {
  const next: NextFunction = jest.fn();

  it('should generate a UUID when no X-Request-Id header exists', () => {
    const req = { headers: {} } as Request;
    const res = { setHeader: jest.fn() } as unknown as Response;

    requestId(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith('X-Request-Id', expect.any(String));
    const id = (res.setHeader as jest.Mock).mock.calls[0][1];
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect(next).toHaveBeenCalled();
  });

  it('should preserve existing X-Request-Id header', () => {
    const req = { headers: { 'x-request-id': 'custom-id-123' } } as unknown as Request;
    const res = { setHeader: jest.fn() } as unknown as Response;

    requestId(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith('X-Request-Id', 'custom-id-123');
    expect(next).toHaveBeenCalled();
  });
});
