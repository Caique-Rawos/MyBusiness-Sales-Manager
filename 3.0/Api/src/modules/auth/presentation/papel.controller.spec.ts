import { Test, TestingModule } from '@nestjs/testing';
import { PapelService } from '../application/papel.service';
import { PapelController } from './papel.controller';
import { JwtPayload } from '../domain/jwt-payload';

describe('PapelController', () => {
  let controller: PapelController;
  let papelService: jest.Mocked<PapelService>;

  const user = { sub: 1, tenantId: 10, schema: 'tenant_10', permissions: [], isOwner: false } as JwtPayload;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PapelController],
      providers: [
        {
          provide: PapelService,
          useValue: { create: jest.fn(), findAllByTenant: jest.fn(), update: jest.fn(), remove: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get(PapelController);
    papelService = module.get(PapelService);
  });

  it('should call create scoped to the current tenant', async () => {
    const result = {} as any;
    papelService.create.mockResolvedValue(result);
    await expect(controller.create({} as any, user)).resolves.toBe(result);
    expect(papelService.create).toHaveBeenCalledWith({}, 10);
  });

  it('should call findAll scoped to the current tenant', async () => {
    const result = [] as any;
    papelService.findAllByTenant.mockResolvedValue(result);
    await expect(controller.findAll(user)).resolves.toBe(result);
    expect(papelService.findAllByTenant).toHaveBeenCalledWith(10);
  });

  it('should call update scoped to the current tenant', async () => {
    const result = {} as any;
    papelService.update.mockResolvedValue(result);
    await expect(controller.update(1, {} as any, user)).resolves.toBe(result);
    expect(papelService.update).toHaveBeenCalledWith(1, 10, {});
  });

  it('should call remove scoped to the current tenant', async () => {
    papelService.remove.mockResolvedValue(undefined);
    await expect(controller.remove(1, user)).resolves.toBeUndefined();
    expect(papelService.remove).toHaveBeenCalledWith(1, 10);
  });
});
