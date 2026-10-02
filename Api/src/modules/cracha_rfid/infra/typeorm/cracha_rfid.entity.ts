import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'cracha_rfid' })
@Unique('UQ_cracha_rfid_hash', ['hash'])
export class CrachaRfidOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nome', type: 'varchar', length: 100, nullable: false })
  nome!: string;

  @Column({ name: 'hash', type: 'varchar', length: 255, nullable: false })
  hash!: string;
}
