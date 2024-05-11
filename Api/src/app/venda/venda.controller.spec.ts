import { Test, TestingModule } from '@nestjs/testing';
import { VendaController } from './venda.controller';

describe('VendaController', () => {
  let controller: VendaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendaController],
    }).compile();

    controller = module.get<VendaController>(VendaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
