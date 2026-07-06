import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { REFRESH_TOKEN_REPOSITORY, RefreshTokenRepository } from '../domain/refresh-token.repository';
import { USUARIO_REPOSITORY, UsuarioRepository } from '../domain/usuario.repository';
import { UsuarioComPermissoes } from '../domain/usuario';
import { JwtPayload } from '../domain/jwt-payload';
import { TENANT_REPOSITORY, TenantRepository } from '../../tenant/domain/tenant.repository';
import { Tenant } from '../../tenant/domain/tenant';

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  usuario: { id: number; email: string; permissions: string[] };
  tenant: { id: number; schema: string };
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: TenantRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, senha: string): Promise<AuthResult> {
    const usuario = await this.usuarioRepository.findByEmailComPermissoes(email);
    if (!usuario || !usuario.ativo) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const tenant = await this.tenantRepository.findById(usuario.tenantId);
    if (!tenant || !tenant.ativo) {
      throw new UnauthorizedException('Loja inativa');
    }

    return this.issueTokens(usuario, tenant);
  }

  async refresh(rawToken: string): Promise<AuthResult> {
    const tokenHash = this.hashToken(rawToken);
    const stored = await this.refreshTokenRepository.findByTokenHash(tokenHash);
    if (!stored || stored.revogadoEm || stored.expiraEm < new Date()) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    await this.refreshTokenRepository.revogar(stored.id);

    const usuario = await this.usuarioRepository.findByIdComPermissoes(stored.usuarioId);
    if (!usuario || !usuario.ativo) {
      throw new UnauthorizedException('Usuário inválido');
    }

    const tenant = await this.tenantRepository.findById(usuario.tenantId);
    if (!tenant || !tenant.ativo) {
      throw new UnauthorizedException('Loja inativa');
    }

    return this.issueTokens(usuario, tenant);
  }

  async logout(rawToken: string): Promise<void> {
    const tokenHash = this.hashToken(rawToken);
    const stored = await this.refreshTokenRepository.findByTokenHash(tokenHash);
    if (stored) {
      await this.refreshTokenRepository.revogar(stored.id);
    }
  }

  private async issueTokens(usuario: UsuarioComPermissoes, tenant: Tenant): Promise<AuthResult> {
    const payload: JwtPayload = {
      sub: usuario.id,
      tenantId: tenant.id,
      schema: tenant.schemaName,
      permissions: usuario.permissions,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    const rawRefreshToken = crypto.randomBytes(48).toString('hex');
    await this.refreshTokenRepository.create({
      usuarioId: usuario.id,
      tokenHash: this.hashToken(rawRefreshToken),
      expiraEm: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      usuario: { id: usuario.id, email: usuario.email, permissions: usuario.permissions },
      tenant: { id: tenant.id, schema: tenant.schemaName },
    };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
