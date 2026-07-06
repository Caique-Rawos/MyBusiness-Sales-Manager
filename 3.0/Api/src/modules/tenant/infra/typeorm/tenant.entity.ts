import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tenant' })
export class TenantOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'schemaName', type: 'varchar', length: 63, unique: true })
  schemaName!: string;

  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo!: boolean;

  @CreateDateColumn({ name: 'criadoEm' })
  criadoEm!: Date;
}
