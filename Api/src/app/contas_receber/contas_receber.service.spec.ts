import { Test, TestingModule } from '@nestjs/testing';
import { ContasReceberService } from './contas_receber.service';

describe('ContasReceberService', () => {
  let service: ContasReceberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContasReceberService],
    }).compile();

    service = module.get<ContasReceberService>(ContasReceberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
