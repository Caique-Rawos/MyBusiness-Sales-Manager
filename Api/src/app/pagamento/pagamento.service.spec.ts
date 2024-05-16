import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoService } from './pagamento.service';

describe('PagamentoService', () => {
  let service: PagamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PagamentoService],
    }).compile();

    service = module.get<PagamentoService>(PagamentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
