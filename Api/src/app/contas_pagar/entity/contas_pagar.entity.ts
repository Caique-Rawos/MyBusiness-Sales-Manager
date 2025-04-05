import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PagamentoEntity } from '../../pagamento/entity/pagamento.entity';
import { StatusPagamentoEntity } from '../../status_pagamento/entity/status_pagamento.entity';

@Entity({ name: 'contas_pagar' })
export class ContasPagarEntity {
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

  @ManyToOne(() => PagamentoEntity)
  @JoinColumn({ name: 'id_pagamento' })
  pagamento: PagamentoEntity;

  @Column({
    name: 'id_status_pagamento',
    type: 'int',
    nullable: false,
  })
  idStatusPagamento!: number;

  @ManyToOne(() => StatusPagamentoEntity)
  @JoinColumn({ name: 'id_status_pagamento' })
  statusPagamento: StatusPagamentoEntity;
}
