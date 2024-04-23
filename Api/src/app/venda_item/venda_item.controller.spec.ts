import { Test, TestingModule } from '@nestjs/testing';
import { VendaItemController } from './venda_item.controller';

describe('CategoriaController', () => {
  let controller: VendaItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendaItemController],
    }).compile();

    controller = module.get<VendaItemController>(VendaItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
