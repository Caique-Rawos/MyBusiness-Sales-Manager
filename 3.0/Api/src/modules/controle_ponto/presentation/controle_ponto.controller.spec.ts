import { ControlePontoController } from './controle_ponto.controller';

describe('ControlePontoController', () => {
  let service: any;
  let controller: ControlePontoController;

  beforeEach(() => {
    service = { baterPonto: jest.fn(), findUltimos7Dias: jest.fn() };
    controller = new ControlePontoController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a punch from the hash', async () => {
    const timestamp = new Date('2026-09-19T14:03:11.482Z');
    service.baterPonto.mockResolvedValue({ id: 1, idCracha: 7, timestamp });
    await expect(controller.baterPonto({ hash: 'abc' })).resolves.toEqual({
      id: 1,
      idCracha: 7,
      timestamp,
    });
    expect(service.baterPonto).toHaveBeenCalledWith('abc');
  });

  it('should return only the timestamps of the last 7 days', async () => {
    const t1 = new Date('2026-09-19T14:03:11.482Z');
    const t2 = new Date('2026-09-18T08:00:00.000Z');
    service.findUltimos7Dias.mockResolvedValue([
      { id: 2, idCracha: 7, timestamp: t1 },
      { id: 1, idCracha: 7, timestamp: t2 },
    ]);
    const result = await controller.findUltimos7Dias({ idCracha: 7 });
    expect(service.findUltimos7Dias).toHaveBeenCalledWith(7);
    expect(result).toEqual([{ timestamp: t1 }, { timestamp: t2 }]);
    result.forEach((item) => expect(Object.keys(item)).toEqual(['timestamp']));
  });
});
