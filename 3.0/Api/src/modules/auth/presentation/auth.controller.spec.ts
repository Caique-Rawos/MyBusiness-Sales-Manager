import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { AuthController } from './auth.controller';

function mockResponse() {
  return { cookie: jest.fn(), clearCookie: jest.fn() } as any;
}

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: { login: jest.fn(), refresh: jest.fn(), logout: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get(AuthController);
    authService = module.get(AuthService);
  });

  it('should login and set the refresh cookie', async () => {
    const result = {
      accessToken: 'access',
      refreshToken: 'refresh',
      usuario: { id: 1 },
      tenant: { id: 1, schema: 'tenant_1' },
    } as any;
    authService.login.mockResolvedValue(result);
    const res = mockResponse();

    const response = await controller.login({ email: 'a@a.com', senha: 'senha123' } as any, res);

    expect(authService.login).toHaveBeenCalledWith('a@a.com', 'senha123');
    expect(res.cookie).toHaveBeenCalledWith('refresh_token', 'refresh', expect.objectContaining({ httpOnly: true }));
    expect(response).toEqual({ accessToken: 'access', usuario: { id: 1 }, tenant: result.tenant });
  });

  it('should refresh using the cookie token and rotate the refresh cookie', async () => {
    const result = {
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
      usuario: { id: 1 },
      tenant: { id: 1, schema: 'tenant_1' },
    } as any;
    authService.refresh.mockResolvedValue(result);
    const req: any = { cookies: { refresh_token: 'old-refresh' } };
    const res = mockResponse();

    const response = await controller.refresh(req, res);

    expect(authService.refresh).toHaveBeenCalledWith('old-refresh');
    expect(res.cookie).toHaveBeenCalledWith('refresh_token', 'new-refresh', expect.any(Object));
    expect(response.accessToken).toBe('new-access');
  });

  it('should throw when refresh cookie is missing', async () => {
    const req: any = { cookies: {} };
    await expect(controller.refresh(req, mockResponse())).rejects.toThrow(UnauthorizedException);
    expect(authService.refresh).not.toHaveBeenCalled();
  });

  it('should logout and clear the refresh cookie when a token is present', async () => {
    const req: any = { cookies: { refresh_token: 'token' } };
    const res = mockResponse();

    const response = await controller.logout(req, res);

    expect(authService.logout).toHaveBeenCalledWith('token');
    expect(res.clearCookie).toHaveBeenCalledWith('refresh_token', { path: '/auth' });
    expect(response).toEqual({ success: true });
  });

  it('should logout without calling the service when no token cookie is present', async () => {
    const req: any = { cookies: {} };
    const res = mockResponse();

    await controller.logout(req, res);

    expect(authService.logout).not.toHaveBeenCalled();
    expect(res.clearCookie).toHaveBeenCalled();
  });
});
