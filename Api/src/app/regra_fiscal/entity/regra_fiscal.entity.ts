import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'regra_fiscal' })
export class RegraFiscalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'descricao', type: 'varchar', length: 100, nullable: false })
  descricao!: string;

  @Column({ name: 'ncm', type: 'varchar', length: 10, nullable: false })
  ncm: string;

  @Column({
    name: 'icms',
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: false,
  })
  icms: number;

  @Column({
    name: 'pis',
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: false,
  })
  pis: number;

  @Column({
    name: 'cofins',
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: false,
  })
  cofins: number;

  @Column({
    name: 'ipi',
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  ipi?: number;
}
