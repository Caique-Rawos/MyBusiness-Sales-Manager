import { Test, TestingModule } from '@nestjs/testing';
import { PaginasController } from './paginas.controller';

describe('PaginasController', () => {
  let controller: PaginasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaginasController],
    }).compile();

    controller = module.get<PaginasController>(PaginasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
