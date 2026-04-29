import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'contagem_cliente' })
export class ContagemClienteOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'contagem', type: 'int', nullable: false, default: 0 })
  contagem!: number;

  @CreateDateColumn({
    name: 'data',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  data: Date;
}
