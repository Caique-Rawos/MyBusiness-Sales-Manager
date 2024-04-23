import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'status_pagamento' })
export class StatusPagamentoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'descricao', type: 'varchar', length: 50, nullable: false })
  descricao!: string;

  @Column({ name: 'cor', type: 'varchar', length: 50, nullable: false })
  cor!: number;
}
