import { CrachaRfid } from './cracha_rfid';
import { CreateCrachaRfidDto } from '../application/dto/create-cracha_rfid.dto';

export const CRACHA_RFID_REPOSITORY = 'CRACHA_RFID_REPOSITORY';

export interface CrachaRfidRepository {
  create(data: CreateCrachaRfidDto): Promise<CrachaRfid>;
  findAll(): Promise<CrachaRfid[]>;
  findById(id: number): Promise<CrachaRfid | null>;
  findByHash(hash: string): Promise<CrachaRfid | null>;
}
