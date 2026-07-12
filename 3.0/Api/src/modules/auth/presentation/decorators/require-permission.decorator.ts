import { SetMetadata } from '@nestjs/common';
import { PermissaoChave } from '../../application/permission-catalog';

export const PERMISSION_KEY = 'requiredPermission';
export const RequirePermission = (permission: PermissaoChave) => SetMetadata(PERMISSION_KEY, permission);
