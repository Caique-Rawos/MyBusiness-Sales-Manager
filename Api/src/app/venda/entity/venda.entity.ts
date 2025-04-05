import { VendaItemEntity } from 'src/app/venda_item/entity/venda_item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClienteEntity } from '../../cliente/entity/cliente.entity';

@Entity({ name: 'venda' })
export class VendaEntity {
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

  @ManyToOne(() => ClienteEntity)
  @JoinColumn({ name: 'id_cliente' })
  cliente: ClienteEntity;

  @OneToMany(() => VendaItemEntity, (item) => item.venda)
  itens: VendaItemEntity[];
}
