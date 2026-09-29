import { CrachaRfidController } from './cracha_rfid.controller';

describe('CrachaRfidController', () => {
  let service: any;
  let controller: CrachaRfidController;

  beforeEach(() => {
    service = { create: jest.fn(), findAll: jest.fn() };
    controller = new CrachaRfidController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create and not expose the hash', async () => {
    const dto = { nome: 'Maria', hash: 'abc' };
    service.create.mockResolvedValue({ id: 1, nome: 'Maria', hash: 'abc' });
    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 1, nome: 'Maria' });
    expect(result).not.toHaveProperty('hash');
  });

  it('should list without exposing the hash', async () => {
    service.findAll.mockResolvedValue([
      { id: 1, nome: 'Maria', hash: 'abc' },
      { id: 2, nome: 'Joao', hash: 'def' },
    ]);
    const result = await controller.findAll();
    expect(result).toEqual([
      { id: 1, nome: 'Maria' },
      { id: 2, nome: 'Joao' },
    ]);
    result.forEach((item) => expect(item).not.toHaveProperty('hash'));
  });
});
