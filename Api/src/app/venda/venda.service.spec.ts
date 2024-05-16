import { Test, TestingModule } from '@nestjs/testing';
import { VendaService } from './venda.service';

describe('CategoriaService', () => {
  let service: VendaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VendaService],
    }).compile();

    service = module.get<VendaService>(VendaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
