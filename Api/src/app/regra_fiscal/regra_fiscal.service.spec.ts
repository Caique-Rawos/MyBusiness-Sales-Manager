import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RegraFiscalEntity } from './entity/regra_fiscal.entity';
import { RegraFiscalService } from './regra_fiscal.service';

const regraFiscalRepositoryMock = {
  create: jest.fn().mockReturnValue({}),
  save: jest.fn().mockReturnValue({}),
  find: jest.fn().mockReturnValue([]),
};

describe('RegraFiscalService', () => {
  let service: RegraFiscalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegraFiscalService,
        {
          provide: getRepositoryToken(RegraFiscalEntity),
          useValue: regraFiscalRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<RegraFiscalService>(RegraFiscalService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new regraFiscal', async () => {
    const regraFiscalData = {} as unknown as RegraFiscalEntity;

    await service.create(regraFiscalData);

    expect(regraFiscalRepositoryMock.create).toHaveBeenCalledWith(
      regraFiscalData,
    );
    expect(regraFiscalRepositoryMock.save).toHaveBeenCalled();
  });

  it('should return all regraFiscals', async () => {
    const result = await service.findAll();

    expect(regraFiscalRepositoryMock.find).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
