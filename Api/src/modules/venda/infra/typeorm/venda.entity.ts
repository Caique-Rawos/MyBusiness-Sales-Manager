import { VendaItemOrmEntity } from 'src/modules/venda_item/infra/typeorm/venda_item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClienteOrmEntity } from 'src/modules/cliente/infra/typeorm/cliente.entity';

@Entity({ name: 'venda' })
export class VendaOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'totalVenda',
    type: 'numeric',
    precision: 13,
    scale: 2,
    nullable: true,
    default: 0.0,
  })
  totalVenda!: number;

  @CreateDateColumn({
    name: 'dataVenda',
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  dataVenda?: Date;

  @Column({
    name: 'id_cliente',
    type: 'int',
    nullable: false,
  })
  idCliente!: number;

  @ManyToOne(() => ClienteOrmEntity)
  @JoinColumn({ name: 'id_cliente' })
  cliente: ClienteOrmEntity;

  @OneToMany(() => VendaItemOrmEntity, (item) => item.venda)
  itens: VendaItemOrmEntity[];
}