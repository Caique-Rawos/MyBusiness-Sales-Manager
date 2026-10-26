import { NotFoundException } from '@nestjs/common';
import { ControlePontoService } from './controle_ponto.service';

let repository: any;
let crachaRfidService: any;
let contagemClienteService: any;
let service: ControlePontoService;

describe('ControlePontoService', () => {
  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findByCrachaSince: jest.fn(),
    };
    crachaRfidService = {
      findByHash: jest.fn(),
      findById: jest.fn(),
    };
    contagemClienteService = {
      subtract: jest.fn(),
    };
    service = new ControlePontoService(
      repository as any,
      crachaRfidService,
      contagemClienteService,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should register a punch for the badge found by hash', async () => {
    const expected = { id: 1, idCracha: 7, timestamp: new Date() };
    crachaRfidService.findByHash.mockResolvedValue({ id: 7, nome: 'Maria', hash: 'abc' });
    repository.create.mockResolvedValue(expected);
    contagemClienteService.subtract.mockResolvedValue(true);
    await expect(service.baterPonto('abc')).resolves.toBe(expected);
    expect(crachaRfidService.findByHash).toHaveBeenCalledWith('abc');
    expect(repository.create).toHaveBeenCalledWith(7);
    expect(contagemClienteService.subtract).toHaveBeenCalled();
  });

  it('should log an error when the client count cannot be subtracted', async () => {
    const expected = { id: 1, idCracha: 7, timestamp: new Date() };
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    crachaRfidService.findByHash.mockResolvedValue({ id: 7, nome: 'Maria', hash: 'abc' });
    repository.create.mockResolvedValue(expected);
    contagemClienteService.subtract.mockResolvedValue(false);

    await expect(service.baterPonto('abc')).resolves.toBe(expected);

    expect(contagemClienteService.subtract).toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledWith(
      'Error occurred while subtracting contagem cliente',
    );
  });

  it('should not register a punch when the hash is unknown', async () => {
    crachaRfidService.findByHash.mockRejectedValue(new NotFoundException());
    await expect(service.baterPonto('xyz')).rejects.toThrow(NotFoundException);
    expect(repository.create).not.toHaveBeenCalled();
    expect(contagemClienteService.subtract).not.toHaveBeenCalled();
  });

  it('should query punches of the last 7 days', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-09-20T12:00:00.000Z'));
    const expected = [{ id: 1, idCracha: 7, timestamp: new Date() }] as any;
    crachaRfidService.findById.mockResolvedValue({ id: 7 });
    repository.findByCrachaSince.mockResolvedValue(expected);
    await expect(service.findUltimos7Dias(7)).resolves.toBe(expected);
    expect(crachaRfidService.findById).toHaveBeenCalledWith(7);
    expect(repository.findByCrachaSince).toHaveBeenCalledWith(
      7,
      new Date('2026-09-13T12:00:00.000Z'),
    );
  });

  it('should throw NotFoundException when the badge does not exist', async () => {
    crachaRfidService.findById.mockRejectedValue(new NotFoundException());
    await expect(service.findUltimos7Dias(99)).rejects.toThrow(NotFoundException);
    expect(repository.findByCrachaSince).not.toHaveBeenCalled();
  });
});
