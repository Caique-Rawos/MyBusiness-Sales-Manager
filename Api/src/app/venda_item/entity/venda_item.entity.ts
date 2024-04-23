import { ClienteEntity } from 'src/app/cliente/entity/cliente.entity';
import { ProdutoEntity } from 'src/app/produto/entity/produtos.entity';
import { VendaEntity } from 'src/app/venda/entity/venda.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

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

  @OneToOne(() => VendaEntity)
  @JoinColumn({ name: 'id_venda' })
  venda: VendaEntity;

  @Column({
    name: 'id_produto',
    type: 'int',
    nullable: false,
  })
  idProduto!: number;

  @OneToOne(() => ProdutoEntity)
  @JoinColumn({ name: 'id_produto' })
  produto: ProdutoEntity;
}
