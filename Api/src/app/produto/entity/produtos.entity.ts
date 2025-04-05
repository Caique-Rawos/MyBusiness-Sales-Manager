import { RegraFiscalEntity } from 'src/app/regra_fiscal/entity/regra_fiscal.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoriaEntity } from '../../categoria/entity/categoria.entity';

@Entity({ name: 'produto' })
export class ProdutoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'descricao', type: 'varchar', length: 100, nullable: false })
  descricao!: string;

  @Column({
    name: 'codigoDeBarra',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  codigoDeBarra?: string;

  @Column({
    name: 'valorCusto',
    type: 'numeric',
    precision: 13,
    scale: 2,
    nullable: false,
  })
  valorCusto!: number;

  @Column({
    name: 'valorVenda',
    type: 'numeric',
    precision: 13,
    scale: 2,
    nullable: false,
  })
  valorVenda!: number;

  @Column({
    name: 'estoque',
    type: 'int',
    nullable: false,
  })
  estoque!: number;

  @Column({
    name: 'unidade',
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  unidade!: string;

  @Column({
    name: 'image',
    type: 'bytea',
    nullable: true,
  })
  image?: string;

  @Column({
    name: 'id_categoria',
    type: 'int',
    nullable: false,
  })
  idCategoria!: number;

  @ManyToOne(() => CategoriaEntity)
  @JoinColumn({ name: 'id_categoria' })
  categoria: CategoriaEntity;

  @Column({
    name: 'id_regra_fiscal',
    type: 'int',
    nullable: true,
  })
  idRegraFiscal!: number;

  @ManyToOne(() => RegraFiscalEntity)
  @JoinColumn({ name: 'id_regra_fiscal' })
  regraFiscal: RegraFiscalEntity;
}
