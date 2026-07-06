import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PermissaoOrmEntity } from './permissao.entity';

@Entity({ name: 'papel' })
export class PapelOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nome', type: 'varchar', length: 60 })
  nome!: string;

  @Column({ name: 'tenantId', type: 'int' })
  tenantId!: number;

  @ManyToMany(() => PermissaoOrmEntity)
  @JoinTable({
    name: 'papel_permissao',
    joinColumn: { name: 'papelId' },
    inverseJoinColumn: { name: 'permissaoId' },
  })
  permissoes!: PermissaoOrmEntity[];
}
