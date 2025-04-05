import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProdutoEntity } from '../../produto/entity/produtos.entity';
import { VendaEntity } from '../../venda/entity/venda.entity';

@Entity({ name: 'venda_item' })
export class VendaItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'precoUnitario',
    type: 'numeric',
    precision: 13,
    scale: 2,
    nullable: false,
  })
  precoUnitario!: number;

  @Column({
    name: 'desconto',
    type: 'numeric',
    precision: 13,
    scale: 2,
    nullable: true,
    default: 0,
  })
  desconto?: number;

  @Column({
    name: 'quantidade',
    type: 'numeric',
    precision: 13,
    scale: 2,
    nullable: false,
  })
  quantidade!: number;

  @Column({
    name: 'subTotal',
    type: 'numeric',
    precision: 13,
    scale: 2,
    nullable: false,
  })
  subTotal!: number;

  @Column({
    name: 'id_venda',
    type: 'int',
    nullable: false,
  })
  idVenda!: number;

  @ManyToOne(() => VendaEntity)
  @JoinColumn({ name: 'id_venda' })
  venda: VendaEntity;

  @Column({
    name: 'id_produto',
    type: 'int',
    nullable: false,
  })
  idProduto!: number;

  @ManyToOne(() => ProdutoEntity)
  @JoinColumn({ name: 'id_produto' })
  produto: ProdutoEntity;
}
