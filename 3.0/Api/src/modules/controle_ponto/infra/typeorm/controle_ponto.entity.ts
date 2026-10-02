import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CrachaRfidOrmEntity } from '../../../cracha_rfid/infra/typeorm/cracha_rfid.entity';

@Entity({ name: 'controle_ponto' })
export class ControlePontoOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_cracha', type: 'int', nullable: false })
  idCracha!: number;

  @ManyToOne(() => CrachaRfidOrmEntity)
  @JoinColumn({ name: 'id_cracha' })
  cracha: CrachaRfidOrmEntity;

  @CreateDateColumn({
    name: 'timestamp',
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  timestamp: Date;
}
