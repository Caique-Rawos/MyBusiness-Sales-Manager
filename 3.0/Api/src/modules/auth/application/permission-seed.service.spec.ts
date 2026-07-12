import { PermissionSeedService } from './permission-seed.service';
import { PERMISSION_CATALOG } from './permission-catalog';

describe('PermissionSeedService', () => {
  it('should upsert the full permission catalog on module init', async () => {
    const permissaoRepository: any = { upsertMany: jest.fn().mockResolvedValue(undefined) };
    const service = new PermissionSeedService(permissaoRepository);

    await service.onModuleInit();

    expect(permissaoRepository.upsertMany).toHaveBeenCalledWith(PERMISSION_CATALOG);
  });
});
