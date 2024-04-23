import { Test, TestingModule } from '@nestjs/testing';
import { VendaItemService } from './venda_item.service';

describe('VendaItemService', () => {
  let service: VendaItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VendaItemService],
    }).compile();

    service = module.get<VendaItemService>(VendaItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
