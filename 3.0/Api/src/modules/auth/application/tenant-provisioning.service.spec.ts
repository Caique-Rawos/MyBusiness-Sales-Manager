import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TenantProvisioningService } from './tenant-provisioning.service';

jest.mock('bcrypt');

describe('TenantProvisioningService', () => {
  let defaultDataSource: any;
  let tenantRepository: any;
  let usuarioRepository: any;
  let papelRepository: any;
  let permissaoRepository: any;
  let tenantConnectionRegistry: any;
  let tenantContext: any;
  let lojaService: any;
  let authService: any;
  let service: TenantProvisioningService;

  const dto = {
    nome: 'Fulano',
    email: 'fulano@teste.com',
    senha: 'senha123',
    nomeFantasia: 'Loja do Fulano',
    cpfCnpj: '12345678900',
    endereco: 'Rua A, 1',
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-senha');

    defaultDataSource = { query: jest.fn().mockResolvedValue(undefined) };
    tenantRepository = {
      create: jest.fn().mockResolvedValue({ id: 7, schemaName: 'pending' }),
      update: jest.fn().mockResolvedValue(undefined),
    };
    usuarioRepository = {
      findByEmailComPermissoes: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: 1, email: dto.email }),
      attachPapel: jest.fn().mockResolvedValue(undefined),
    };
    papelRepository = {
      create: jest.fn().mockResolvedValue({ id: 2, nome: 'Administrador' }),
    };
    permissaoRepository = {
      findAll: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
    };
    tenantConnectionRegistry = { ensureDataSource: jest.fn().mockResolvedValue(undefined) };
    tenantContext = {
      runWithTenant: jest.fn().mockImplementation((_store: unknown, fn: () => Promise<unknown>) => fn()),
    };
    lojaService = { create: jest.fn().mockResolvedValue({ id: 7 }) };
    authService = { login: jest.fn().mockResolvedValue({ accessToken: 'token' }) };

    service = new TenantProvisioningService(
      defaultDataSource,
      tenantRepository,
      usuarioRepository,
      papelRepository,
      permissaoRepository,
      tenantConnectionRegistry,
      tenantContext,
      lojaService,
      authService,
    );
  });

  it('should throw ConflictException when e-mail is already in use', async () => {
    usuarioRepository.findByEmailComPermissoes.mockResolvedValue({ id: 1 });
    await expect(service.signup(dto)).rejects.toThrow(ConflictException);
    expect(tenantRepository.create).not.toHaveBeenCalled();
  });

  it('should provision a new tenant end-to-end and return the login result', async () => {
    const result = await service.signup(dto);

    expect(tenantRepository.create).toHaveBeenCalledWith({ schemaName: 'pending' });
    expect(tenantRepository.update).toHaveBeenCalledWith(7, { schemaName: 'tenant_7' });
    expect(defaultDataSource.query).toHaveBeenCalledWith('CREATE SCHEMA IF NOT EXISTS "tenant_7"');
    expect(tenantConnectionRegistry.ensureDataSource).toHaveBeenCalledWith('tenant_7');
    expect(tenantContext.runWithTenant).toHaveBeenCalledWith(
      { schema: 'tenant_7', tenantId: 7 },
      expect.any(Function),
    );
    expect(lojaService.create).toHaveBeenCalledWith({
      nomeFantasia: dto.nomeFantasia,
      cpfCnpj: dto.cpfCnpj,
      endereco: dto.endereco,
      ie: undefined,
    });
    expect(usuarioRepository.create).toHaveBeenCalledWith({
      nome: dto.nome,
      email: dto.email,
      senhaHash: 'hashed-senha',
      tenantId: 7,
      isOwner: true,
    });
    expect(papelRepository.create).toHaveBeenCalledWith({
      nome: 'Administrador',
      tenantId: 7,
      permissaoIds: [1, 2],
    });
    expect(usuarioRepository.attachPapel).toHaveBeenCalledWith(1, 2);
    expect(authService.login).toHaveBeenCalledWith(dto.email, dto.senha);
    expect(result).toEqual({ accessToken: 'token' });
  });

  it('should drop the tenant schema and rethrow when provisioning fails', async () => {
    const failure = new Error('loja creation failed');
    lojaService.create.mockRejectedValue(failure);

    await expect(service.signup(dto)).rejects.toThrow(failure);
    expect(defaultDataSource.query).toHaveBeenCalledWith('DROP SCHEMA IF EXISTS "tenant_7" CASCADE');
  });

  it('should still rethrow the original error even when dropping the schema also fails', async () => {
    const failure = new Error('loja creation failed');
    lojaService.create.mockRejectedValue(failure);
    defaultDataSource.query.mockImplementation((sql: string) => {
      if (sql.startsWith('DROP SCHEMA')) {
        return Promise.reject(new Error('drop failed'));
      }
      return Promise.resolve(undefined);
    });

    await expect(service.signup(dto)).rejects.toThrow(failure);
  });
});
