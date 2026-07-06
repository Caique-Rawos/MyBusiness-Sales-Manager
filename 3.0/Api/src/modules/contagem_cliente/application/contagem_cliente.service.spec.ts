import { ContagemClienteService } from './contagem_cliente.service';

let repository: any;
let service: ContagemClienteService;

describe('ContagemClienteService', () => {
  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByVendaId: jest.fn(),
      findToday: jest.fn(),
      findByAlias: jest.fn(),
      findVendasFuturasBase: jest.fn(),
      findAllGroupByCliente: jest.fn(),
      findAllGroupByData: jest.fn(),
      getCupomItens: jest.fn(),
      atualizaTotal: jest.fn(),
      atualizaEstoque: jest.fn(),
    };
    service = new ContagemClienteService(repository as any);
  });

  it('should add when autorizado is true and today entry exists', async () => {
    repository.findToday.mockResolvedValue({ contagem: 1, id: 1 } as any);
    await expect(service.add({ autorizado: true } as any)).resolves.toBe(true);
    expect(repository.findToday).toHaveBeenCalled();
    expect(repository.update).toHaveBeenCalled();
  });

  it('should add when autorizado is true and today entry does not exist', async () => {
    repository.findToday.mockResolvedValue(null);
    await expect(service.add({ autorizado: true } as any)).resolves.toBe(true);
    expect(repository.create).toHaveBeenCalled();
  });

  it('should return false when autorizado is false', async () => {
    await expect(service.add({ autorizado: false } as any)).resolves.toBe(
      false,
    );
  });

  it('should find today entry', async () => {
    const expected = {} as any;
    repository.findToday.mockResolvedValue(expected);
    await expect(service.findToday()).resolves.toBe(expected);
    expect(repository.findToday).toHaveBeenCalled();
  });
});
