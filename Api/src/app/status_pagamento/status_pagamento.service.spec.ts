import { Test, TestingModule } from '@nestjs/testing';
import { StatusPagamentoService } from './status_pagamento.service';

describe('StatusPagamentoService', () => {
  let service: StatusPagamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusPagamentoService],
    }).compile();

    service = module.get<StatusPagamentoService>(StatusPagamentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
