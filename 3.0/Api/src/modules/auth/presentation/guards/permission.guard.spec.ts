import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PermissionGuard } from './permission.guard';

function buildContext(user?: any): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
    getHandler: () => jest.fn(),
    getClass: () => jest.fn(),
  } as unknown as ExecutionContext;
}

describe('PermissionGuard', () => {
  let reflector: any;
  let guard: PermissionGuard;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() };
    guard = new PermissionGuard(reflector);
  });

  it('should allow the route when no permission is required', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    const context = buildContext({ permissions: [] });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow when user is owner regardless of permissions', () => {
    reflector.getAllAndOverride.mockReturnValue('venda:deletar');
    const context = buildContext({ isOwner: true, permissions: [] });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow when user has the required permission', () => {
    reflector.getAllAndOverride.mockReturnValue('venda:deletar');
    const context = buildContext({ isOwner: false, permissions: ['venda:deletar'] });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException when user lacks the required permission', () => {
    reflector.getAllAndOverride.mockReturnValue('venda:deletar');
    const context = buildContext({ isOwner: false, permissions: ['venda:listar'] });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException when request has no user at all', () => {
    reflector.getAllAndOverride.mockReturnValue('venda:deletar');
    const context = buildContext(undefined);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
