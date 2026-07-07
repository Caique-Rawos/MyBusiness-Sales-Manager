import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let usuarioRepository: any;
  let refreshTokenRepository: any;
  let tenantRepository: any;
  let jwtService: any;
  let service: AuthService;

  const usuario = {
    id: 1,
    nome: 'Fulano',
    email: 'fulano@teste.com',
    senhaHash: 'hash',
    tenantId: 10,
    ativo: true,
    isOwner: false,
    permissions: ['venda:listar'],
  } as any;

  const tenant = { id: 10, schemaName: 'tenant_10', ativo: true } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    usuarioRepository = {
      findByEmailComPermissoes: jest.fn(),
      findByIdComPermissoes: jest.fn(),
    };
    refreshTokenRepository = {
      create: jest.fn().mockResolvedValue({ id: 1 }),
      findByTokenHash: jest.fn(),
      revogar: jest.fn().mockResolvedValue(undefined),
    };
    tenantRepository = { findById: jest.fn() };
    jwtService = { signAsync: jest.fn().mockResolvedValue('signed.jwt') };
    service = new AuthService(usuarioRepository, refreshTokenRepository, tenantRepository, jwtService);
  });

  describe('login', () => {
    it('should issue tokens when credentials are valid', async () => {
      usuarioRepository.findByEmailComPermissoes.mockResolvedValue(usuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      tenantRepository.findById.mockResolvedValue(tenant);

      const result = await service.login('fulano@teste.com', 'senha123');

      expect(result.accessToken).toBe('signed.jwt');
      expect(result.refreshToken).toEqual(expect.any(String));
      expect(result.usuario).toEqual({
        id: 1,
        nome: 'Fulano',
        email: 'fulano@teste.com',
        permissions: ['venda:listar'],
        isOwner: false,
      });
      expect(result.tenant).toEqual({ id: 10, schema: 'tenant_10' });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 1,
        tenantId: 10,
        schema: 'tenant_10',
        permissions: ['venda:listar'],
        isOwner: false,
      });
      expect(refreshTokenRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ usuarioId: 1 }),
      );
    });

    it('should throw when usuario is not found', async () => {
      usuarioRepository.findByEmailComPermissoes.mockResolvedValue(null);
      await expect(service.login('x@x.com', 'senha')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw when usuario is inactive', async () => {
      usuarioRepository.findByEmailComPermissoes.mockResolvedValue({ ...usuario, ativo: false });
      await expect(service.login('fulano@teste.com', 'senha')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw when senha is invalid', async () => {
      usuarioRepository.findByEmailComPermissoes.mockResolvedValue(usuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login('fulano@teste.com', 'errada')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw when tenant is not found', async () => {
      usuarioRepository.findByEmailComPermissoes.mockResolvedValue(usuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      tenantRepository.findById.mockResolvedValue(null);
      await expect(service.login('fulano@teste.com', 'senha123')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw when tenant is inactive', async () => {
      usuarioRepository.findByEmailComPermissoes.mockResolvedValue(usuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      tenantRepository.findById.mockResolvedValue({ ...tenant, ativo: false });
      await expect(service.login('fulano@teste.com', 'senha123')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    const stored = {
      id: 5,
      usuarioId: 1,
      tokenHash: 'hash',
      expiraEm: new Date(Date.now() + 60_000),
      revogadoEm: null,
    };

    it('should rotate tokens when refresh token is valid', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue(stored);
      usuarioRepository.findByIdComPermissoes.mockResolvedValue(usuario);
      tenantRepository.findById.mockResolvedValue(tenant);

      const result = await service.refresh('raw-token');

      expect(refreshTokenRepository.revogar).toHaveBeenCalledWith(5);
      expect(result.accessToken).toBe('signed.jwt');
    });

    it('should throw when stored token is not found', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue(null);
      await expect(service.refresh('raw-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw when stored token was already revoked', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue({ ...stored, revogadoEm: new Date() });
      await expect(service.refresh('raw-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw when stored token is expired', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue({
        ...stored,
        expiraEm: new Date(Date.now() - 60_000),
      });
      await expect(service.refresh('raw-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw when usuario no longer exists or is inactive', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue(stored);
      usuarioRepository.findByIdComPermissoes.mockResolvedValue(null);
      await expect(service.refresh('raw-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw when tenant is inactive on refresh', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue(stored);
      usuarioRepository.findByIdComPermissoes.mockResolvedValue(usuario);
      tenantRepository.findById.mockResolvedValue({ ...tenant, ativo: false });
      await expect(service.refresh('raw-token')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should revoke the stored refresh token when found', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue({ id: 9 });
      await expect(service.logout('raw-token')).resolves.toBeUndefined();
      expect(refreshTokenRepository.revogar).toHaveBeenCalledWith(9);
    });

    it('should do nothing when no stored token is found', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue(null);
      await expect(service.logout('raw-token')).resolves.toBeUndefined();
      expect(refreshTokenRepository.revogar).not.toHaveBeenCalled();
    });
  });
});
