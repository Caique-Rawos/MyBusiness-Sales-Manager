import { Test, TestingModule } from '@nestjs/testing';
import { StatusPagamentoController } from './status_pagamento.controller';

describe('StatusPagamentoController', () => {
  let controller: StatusPagamentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusPagamentoController],
    }).compile();

    controller = module.get<StatusPagamentoController>(
      StatusPagamentoController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
