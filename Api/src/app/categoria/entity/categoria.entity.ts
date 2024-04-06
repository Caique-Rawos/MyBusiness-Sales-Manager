import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'categoria' })
export class CategoriaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'descricao', type: 'varchar', length: 100, nullable: false })
  descricao!: string;
}
