import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TenantConnectionRegistryService } from 'src/shared/tenant/tenant-connection-registry.service';
import { TenantContextService } from 'src/shared/tenant/tenant-context.service';
import { JwtPayload } from '../../domain/jwt-payload';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly tenantContext: TenantContextService,
    private readonly tenantConnectionRegistry: TenantConnectionRegistryService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Token não informado');
    }

    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    // getRepository() e sincrono -- precisa do DataSource ja pronto antes da request seguir.
    await this.tenantConnectionRegistry.ensureDataSource(payload.schema);

    this.tenantContext.setTenant({
      schema: payload.schema,
      tenantId: payload.tenantId,
      permissions: payload.permissions,
    });
    (request as Request & { user: JwtPayload }).user = payload;
    return true;
  }

  private extractToken(request: Request): string | undefined {
    const authHeader = request.headers?.authorization;
    if (!authHeader) {
      return undefined;
    }
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
