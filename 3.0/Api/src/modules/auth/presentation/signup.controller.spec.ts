import { Test, TestingModule } from '@nestjs/testing';
import { TenantProvisioningService } from '../application/tenant-provisioning.service';
import { SignupController } from './signup.controller';

describe('SignupController', () => {
  let controller: SignupController;
  let tenantProvisioningService: jest.Mocked<TenantProvisioningService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignupController],
      providers: [{ provide: TenantProvisioningService, useValue: { signup: jest.fn() } }],
    }).compile();

    controller = module.get(SignupController);
    tenantProvisioningService = module.get(TenantProvisioningService);
  });

  it('should provision the tenant and set the refresh cookie', async () => {
    const result = {
      accessToken: 'access',
      refreshToken: 'refresh',
      usuario: { id: 1 },
      tenant: { id: 1, schema: 'tenant_1' },
    } as any;
    tenantProvisioningService.signup.mockResolvedValue(result);
    const dto = { nome: 'Fulano', email: 'a@a.com', senha: 'senha123' } as any;
    const res = { cookie: jest.fn() } as any;

    const response = await controller.signup(dto, res);

    expect(tenantProvisioningService.signup).toHaveBeenCalledWith(dto);
    expect(res.cookie).toHaveBeenCalledWith('refresh_token', 'refresh', expect.objectContaining({ httpOnly: true }));
    expect(response).toEqual({ accessToken: 'access', usuario: { id: 1 }, tenant: result.tenant });
  });
});
