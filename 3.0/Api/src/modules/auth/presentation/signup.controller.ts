import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { TenantProvisioningService } from '../application/tenant-provisioning.service';
import { SignupDto } from '../application/dto/signup.dto';
import { Public } from './decorators/public.decorator';

const REFRESH_COOKIE_NAME = 'refresh_token';
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

@ApiTags('Tenants')
@Controller('tenants')
export class SignupController {
  constructor(private readonly tenantProvisioningService: TenantProvisioningService) {}

  @Public()
  @ApiOperation({ summary: 'Criar uma nova loja (self-service) e o usuário administrador' })
  @Post('signup')
  async signup(@Body() dto: SignupDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.tenantProvisioningService.signup(dto);
    res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_COOKIE_MAX_AGE_MS,
      path: '/auth',
    });
    return {
      accessToken: result.accessToken,
      usuario: result.usuario,
      tenant: result.tenant,
    };
  }
}
