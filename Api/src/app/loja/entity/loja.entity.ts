import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'loja' })
export class LojaEntity {
  @PrimaryColumn()
  id: number;

  @Column({
    name: 'nomeFantasia',
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  nomeFantasia!: string;

  @Column({ name: 'cpfCnpj', type: 'varchar', length: 18, nullable: false })
  cpfCnpj!: string;

  @Column({
    name: 'ie',
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  ie?: string;

  @Column({
    name: 'endereco',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  endereco!: string;
}
