import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'refresh_token' })
export class RefreshTokenOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuarioId', type: 'int' })
  usuarioId!: number;

  @Column({ name: 'tokenHash', type: 'varchar', length: 255 })
  tokenHash!: string;

  @Column({ name: 'expiraEm', type: 'timestamp' })
  expiraEm!: Date;

  @Column({ name: 'revogadoEm', type: 'timestamp', nullable: true })
  revogadoEm!: Date | null;

  @CreateDateColumn({ name: 'criadoEm' })
  criadoEm!: Date;
}
