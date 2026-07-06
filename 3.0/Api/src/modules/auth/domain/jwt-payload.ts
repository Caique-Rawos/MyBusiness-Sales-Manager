export interface JwtPayload {
  sub: number;
  tenantId: number;
  schema: string;
  permissions: string[];
  isOwner: boolean;
}
