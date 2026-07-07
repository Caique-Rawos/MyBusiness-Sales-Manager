import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from '../application/usuario.service';
import { UsuarioController } from './usuario.controller';
import { JwtPayload } from '../domain/jwt-payload';

describe('UsuarioController', () => {
  let controller: UsuarioController;
  let usuarioService: jest.Mocked<UsuarioService>;

  const user = { sub: 99, tenantId: 10, schema: 'tenant_10', permissions: [], isOwner: false } as JwtPayload;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        {
          provide: UsuarioService,
          useValue: { create: jest.fn(), findAllByTenant: jest.fn(), updatePapeis: jest.fn(), remove: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get(UsuarioController);
    usuarioService = module.get(UsuarioService);
  });

  it('should create a usuario and strip senhaHash from the response', async () => {
    usuarioService.create.mockResolvedValue({
      id: 1,
      nome: 'Fulano',
      email: 'a@a.com',
      senhaHash: 'super-secret-hash',
      papeis: [],
    } as any);

    const result = await controller.create({} as any, user);

    expect(usuarioService.create).toHaveBeenCalledWith({}, 10);
    expect(result).not.toHaveProperty('senhaHash');
    expect(result).toEqual({ id: 1, nome: 'Fulano', email: 'a@a.com', papeis: [] });
  });

  it('should list usuarios stripping senhaHash from every item', async () => {
    usuarioService.findAllByTenant.mockResolvedValue([
      { id: 1, nome: 'A', email: 'a@a.com', senhaHash: 'hash-1', papeis: [] },
      { id: 2, nome: 'B', email: 'b@b.com', senhaHash: 'hash-2', papeis: [] },
    ] as any);

    const result = await controller.findAll(user);

    expect(usuarioService.findAllByTenant).toHaveBeenCalledWith(10);
    expect(result.every((u: any) => !('senhaHash' in u))).toBe(true);
  });

  it('should update papeis scoped to the current tenant', async () => {
    usuarioService.updatePapeis.mockResolvedValue(undefined);
    await controller.updatePapeis(1, { papelIds: [1, 2] } as any, user);
    expect(usuarioService.updatePapeis).toHaveBeenCalledWith(1, 10, [1, 2]);
  });

  it('should remove a usuario scoped to the current tenant and user', async () => {
    usuarioService.remove.mockResolvedValue(undefined);
    await controller.remove(1, user);
    expect(usuarioService.remove).toHaveBeenCalledWith(1, 10, 99);
  });
});
