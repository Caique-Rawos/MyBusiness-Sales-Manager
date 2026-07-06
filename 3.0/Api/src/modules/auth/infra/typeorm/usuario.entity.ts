import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PapelOrmEntity } from './papel.entity';

@Entity({ name: 'usuario' })
export class UsuarioOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nome', type: 'varchar', length: 120 })
  nome!: string;

  @Column({ name: 'email', type: 'varchar', length: 160, unique: true })
  email!: string;

  @Column({ name: 'senhaHash', type: 'varchar', length: 255 })
  senhaHash!: string;

  @Column({ name: 'tenantId', type: 'int' })
  tenantId!: number;

  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo!: boolean;

  @CreateDateColumn({ name: 'criadoEm' })
  criadoEm!: Date;

  @ManyToMany(() => PapelOrmEntity)
  @JoinTable({
    name: 'usuario_papel',
    joinColumn: { name: 'usuarioId' },
    inverseJoinColumn: { name: 'papelId' },
  })
  papeis!: PapelOrmEntity[];
}
