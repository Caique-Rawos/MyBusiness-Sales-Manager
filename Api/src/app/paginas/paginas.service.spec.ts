import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaginasService } from './paginas.service';
import { PaginasEntity } from './entity/paginas.entity';
import { Repository } from 'typeorm';

describe('PaginasService', () => {
  let service: PaginasService;
  let repository: Repository<PaginasEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaginasService,
        {
          provide: getRepositoryToken(PaginasEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PaginasService>(PaginasService);
    repository = module.get<Repository<PaginasEntity>>(
      getRepositoryToken(PaginasEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a PaginasEntity when getPaginaByAlias is called', async () => {
    const alias = 'test-alias';
    const expectedResult: PaginasEntity = {
      id: 1,
      alias: 'test-alias',
      descricao: 'teste',
      arquivo: 'teste/teste.html',
      ativo: true,
    };

    jest.spyOn(repository, 'findOne').mockResolvedValue(expectedResult);

    const result = await service.getPaginaByAlias(alias);
    expect(result).toEqual(expectedResult);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { alias: alias },
    });
  });
});
