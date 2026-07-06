import { Test, TestingModule } from '@nestjs/testing';
import { ContagemClienteService } from '../application/contagem_cliente.service';
import { ContagemClienteController } from './cliente.controller';

describe('ContagemClienteController', () => {
  let controller: ContagemClienteController;
  let contagemClienteService: jest.Mocked<ContagemClienteService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContagemClienteController],
      providers: [
        {
          provide: ContagemClienteService,
          useValue: {
            add: jest.fn(),
            findToday: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ContagemClienteController>(
      ContagemClienteController,
    );
    contagemClienteService = module.get<ContagemClienteService>(
      ContagemClienteService,
    ) as jest.Mocked<ContagemClienteService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call add', async () => {
    const result = {} as any;
    contagemClienteService.add.mockResolvedValue(result);
    await expect(controller.add({} as any)).resolves.toBe(result);
    expect(contagemClienteService.add).toHaveBeenCalledWith({} as any);
  });

  it('should call findToday', async () => {
    const result = {} as any;
    contagemClienteService.findToday.mockResolvedValue(result);
    await expect(controller.findToday()).resolves.toBe(result);
    expect(contagemClienteService.findToday).toHaveBeenCalledWith();
  });
});
