import { Test, TestingModule } from '@nestjs/testing';
import { PaginasService } from '../application/Paginas.service';
import { PaginasController } from './paginas.controller';

describe('PaginasController', () => {
  let controller: PaginasController;
  let paginasService: jest.Mocked<PaginasService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaginasController],
      providers: [
        {
          provide: PaginasService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByAlias: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PaginasController>(PaginasController);
    paginasService = module.get<PaginasService>(
      PaginasService,
    ) as jest.Mocked<PaginasService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create', async () => {
    const result = {} as any;
    paginasService.create.mockResolvedValue(result);
    await expect(controller.create({} as any)).resolves.toBe(result);
    expect(paginasService.create).toHaveBeenCalledWith({} as any);
  });

  it('should call findAll', async () => {
    const result = {} as any;
    paginasService.findAll.mockResolvedValue(result);
    await expect(controller.findAll()).resolves.toBe(result);
    expect(paginasService.findAll).toHaveBeenCalledWith();
  });

  it('should call findByAlias', async () => {
    const result = {} as any;
    paginasService.findByAlias.mockResolvedValue(result);
    await expect(controller.findByAlias('alias')).resolves.toBe(result);
    expect(paginasService.findByAlias).toHaveBeenCalledWith('alias');
  });

  it('should call update', async () => {
    const result = {} as any;
    paginasService.update.mockResolvedValue(result);
    await expect(controller.update('1', {} as any)).resolves.toBe(result);
    expect(paginasService.update).toHaveBeenCalledWith('1', {} as any);
  });

  it('should call delete', async () => {
    const result = {} as any;
    paginasService.delete.mockResolvedValue(result);
    await expect(controller.delete('1')).resolves.toBe(result);
    expect(paginasService.delete).toHaveBeenCalledWith('1');
  });
});
