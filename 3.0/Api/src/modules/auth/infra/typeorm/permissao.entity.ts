import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'permissao' })
export class PermissaoOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'chave', type: 'varchar', length: 80, unique: true })
  chave!: string;

  @Column({ name: 'descricao', type: 'varchar', length: 160 })
  descricao!: string;
}
