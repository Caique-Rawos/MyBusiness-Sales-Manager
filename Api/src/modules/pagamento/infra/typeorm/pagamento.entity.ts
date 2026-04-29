import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'pagamento' })
export class PagamentoOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'descricao', type: 'varchar', length: 50, nullable: false })
  descricao!: string;

  @Column({
    name: 'taxa',
    type: 'numeric',
    precision: 13,
    scale: 2,
    nullable: true,
    default: 0,
  })
  taxa?: number;
}