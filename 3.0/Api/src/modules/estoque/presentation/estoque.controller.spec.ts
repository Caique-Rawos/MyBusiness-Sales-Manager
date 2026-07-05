import { EstoqueController } from './estoque.controller';

let service: any;
let controller: EstoqueController;

describe('EstoqueController', () => {
  beforeEach(() => {
    service = { findAll: jest.fn() };
    controller = new EstoqueController(service);
  });

  it('should call findAll with filtro and return result', async () => {
    const filtro = { idProduto: 1 } as any;
    const expected = [{ id: 1 }] as any;
    service.findAll.mockResolvedValue(expected);
    await expect(controller.findAll(filtro)).resolves.toBe(expected);
    expect(service.findAll).toHaveBeenCalledWith(filtro);
  });
});
