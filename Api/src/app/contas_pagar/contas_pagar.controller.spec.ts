import { Test, TestingModule } from '@nestjs/testing';
import { ContasPagarController } from './contas_pagar.controller';

describe('ContasPagarController', () => {
  let controller: ContasPagarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContasPagarController],
    }).compile();

    controller = module.get<ContasPagarController>(ContasPagarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
