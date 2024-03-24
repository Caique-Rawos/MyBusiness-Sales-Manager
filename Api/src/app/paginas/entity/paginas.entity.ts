import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'paginas' })
export class PaginasEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'descricao', type: 'varchar', length: 100, nullable: false })
  descricao: string;

  @Column({ name: 'alias', type: 'varchar', length: 100, nullable: false })
  alias: string;

  @Column({ name: 'arquivo', type: 'varchar', length: 255, nullable: false })
  arquivo: string;

  @Column({ name: 'ativo', type: 'boolean', nullable: false, default: true })
  ativo: boolean;
}
