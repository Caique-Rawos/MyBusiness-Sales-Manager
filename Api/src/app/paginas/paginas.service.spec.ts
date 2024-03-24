import { Test, TestingModule } from '@nestjs/testing';
import { PaginasService } from './paginas.service';

describe('PaginasService', () => {
  let service: PaginasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaginasService],
    }).compile();

    service = module.get<PaginasService>(PaginasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
