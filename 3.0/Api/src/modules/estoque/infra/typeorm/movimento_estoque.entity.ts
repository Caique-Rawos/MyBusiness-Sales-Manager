import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProdutoOrmEntity } from 'src/modules/produto/infra/typeorm/produto.entity';
import { TipoMovimento } from '../../domain/movimento_estoque';

@Entity({ name: 'movimento_estoque' })
export class MovimentoEstoqueOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  tipo: TipoMovimento;

  @Column({ type: 'numeric', precision: 13, scale: 2 })
  quantidade: number;

  @Column({ name: 'id_produto', type: 'int' })
  idProduto: number;

  @ManyToOne(() => ProdutoOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_produto' })
  produto: ProdutoOrmEntity;

  @Column({ type: 'varchar', length: 100, nullable: true })
  motivo?: string;

  @Column({ name: 'id_venda', type: 'int', nullable: true })
  idVenda?: number;

  @Column({ name: 'id_venda_item', type: 'int', nullable: true })
  idVendaItem?: number;

  @CreateDateColumn({ name: 'data_movimento' })
  dataMovimento: Date;
}
