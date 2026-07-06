import { RefreshToken } from './refresh-token';

export const REFRESH_TOKEN_REPOSITORY = 'REFRESH_TOKEN_REPOSITORY';

export interface CreateRefreshTokenData {
  usuarioId: number;
  tokenHash: string;
  expiraEm: Date;
}

export interface RefreshTokenRepository {
  create(data: CreateRefreshTokenData): Promise<RefreshToken>;
  findByTokenHash(tokenHash: string): Promise<RefreshToken | null>;
  revogar(id: number): Promise<void>;
}
