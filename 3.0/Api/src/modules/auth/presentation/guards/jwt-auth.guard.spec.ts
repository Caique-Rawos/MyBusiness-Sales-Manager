import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

function buildContext(request: any): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: () => jest.fn(),
    getClass: () => jest.fn(),
  } as unknown as ExecutionContext;
}

describe('JwtAuthGuard', () => {
  let reflector: any;
  let jwtService: any;
  let tenantContext: any;
  let tenantConnectionRegistry: any;
  let guard: JwtAuthGuard;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() };
    jwtService = { verifyAsync: jest.fn() };
    tenantContext = { setTenant: jest.fn() };
    tenantConnectionRegistry = { ensureDataSource: jest.fn().mockResolvedValue(undefined) };
    guard = new JwtAuthGuard(reflector, jwtService, tenantContext, tenantConnectionRegistry);
  });

  it('should allow public routes without checking token', async () => {
    reflector.getAllAndOverride.mockReturnValue(true);
    const context = buildContext({ headers: {} });
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('should throw when authorization header is missing', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    const context = buildContext({ headers: {} });
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw when authorization header is not a Bearer token', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    const context = buildContext({ headers: { authorization: 'Basic abc123' } });
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw when token verification fails', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    jwtService.verifyAsync.mockRejectedValue(new Error('invalid signature'));
    const context = buildContext({ headers: { authorization: 'Bearer bad.token' } });
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should ensure tenant data source, set tenant context and populate request.user when token is valid', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    const payload = { sub: 1, tenantId: 2, schema: 'tenant_2', permissions: ['venda:listar'], isOwner: false };
    jwtService.verifyAsync.mockResolvedValue(payload);
    const request: any = { headers: { authorization: 'Bearer good.token' } };
    const context = buildContext(request);

    await expect(guard.canActivate(context)).resolves.toBe(true);

    expect(tenantConnectionRegistry.ensureDataSource).toHaveBeenCalledWith('tenant_2');
    expect(tenantContext.setTenant).toHaveBeenCalledWith({
      schema: 'tenant_2',
      tenantId: 2,
      permissions: ['venda:listar'],
    });
    expect(request.user).toBe(payload);
  });
});
