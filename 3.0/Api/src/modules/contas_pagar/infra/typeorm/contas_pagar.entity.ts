import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PagamentoOrmEntity } from 'src/modules/pagamento/infra/typeorm/pagamento.entity';
import { StatusPagamentoOrmEntity } from 'src/modules/status_pagamento/infra/typeorm/status_pagamento.entity';

@Entity({ name: 'contas_pagar' })
export class ContasPagarOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'descricao', type: 'varchar', length: 150, nullable: false })
  descricao!: string;

  @Column({
    name: 'valorTotal',
    type: 'numeric',
    precision: 13,
    scale: 2,
    nullable: false,
  })
  valorTotal!: number;

  @Column({
    name: 'valorPago',
    type: 'numeric',
    precision: 13,
    scale: 2,
    nullable: true,
    default: 0,
  })
  valorPago?: number;

  @CreateDateColumn({
    name: 'dataVencimento',
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  dataVencimento: Date;

  @Column({
    name: 'id_pagamento',
    type: 'int',
    nullable: false,
  })
  idPagamento!: number;

  @ManyToOne(() => PagamentoOrmEntity)
  @JoinColumn({ name: 'id_pagamento' })
  pagamento: PagamentoOrmEntity;

  @Column({
    name: 'id_status_pagamento',
    type: 'int',
    nullable: false,
  })
  idStatusPagamento!: number;

  @ManyToOne(() => StatusPagamentoOrmEntity)
  @JoinColumn({ name: 'id_status_pagamento' })
  statusPagamento: StatusPagamentoOrmEntity;
}