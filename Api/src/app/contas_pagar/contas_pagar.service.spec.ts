import { Test, TestingModule } from '@nestjs/testing';
import { ContasPagarService } from './contas_pagar.service';

describe('ContasPagarService', () => {
  let service: ContasPagarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContasPagarService],
    }).compile();

    service = module.get<ContasPagarService>(ContasPagarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
