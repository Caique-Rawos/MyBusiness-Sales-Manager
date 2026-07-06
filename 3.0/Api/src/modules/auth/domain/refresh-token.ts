export interface RefreshToken {
  id: number;
  usuarioId: number;
  tokenHash: string;
  expiraEm: Date;
  revogadoEm: Date | null;
  criadoEm: Date;
}
