import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'requiredPermission';
export const RequirePermission = (permission: string) => SetMetadata(PERMISSION_KEY, permission);
