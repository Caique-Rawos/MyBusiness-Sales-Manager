import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cliente' })
export class ClienteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nome', type: 'varchar', length: 100, nullable: false })
  nome!: string;

  @Column({ name: 'cpfCnpj', type: 'varchar', length: 15, nullable: false })
  cpfCnpj!: string;

  @Column({ name: 'observacao', type: 'text', nullable: true })
  observacao?: string;
}
